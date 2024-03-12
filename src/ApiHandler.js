import ReactGA from "react-ga4";
import {
  AUTOWEB_PROVIDER_ID,
  DETROIT_GENERATOR_ID,
  DETROIT_PASSWORD,
  SITE_URL,
} from "Settings";

var _xml = require("xml-js");

// HEADERS
const detroitHeaders = new Headers();
detroitHeaders.append("Content-Type", "application/json");
detroitHeaders.append("Accept", "application/json");

const autowebHeaders = new Headers();
autowebHeaders.append("Content-Type", "application/x-www-form-urlencoded");
autowebHeaders.append(
  "Accept",
  "text/html,application/xhtml+xml,application/xml"
);

function getDealersAutoWeb(carSelection) {
  return fetch("/autoweb-ping", {
    body: new URLSearchParams({
      providerID: AUTOWEB_PROVIDER_ID,
      year: "2024",
      make: carSelection.make,
      model: carSelection.model,
      trim: "",
      zipCode: carSelection.postalCode,
    }).toString(),
    method: "POST",
    headers: autowebHeaders,
  })
    .then((response) => response.text())
    .then((str) => _xml.xml2js(str, { compact: true, spaces: 4 }).PingResult)
    .then((data) =>
      data.Dealers.Dealer.map((dealer) => ({
        _provider: "autoweb",
        name: dealer.Name._text,
        address: dealer.Address._text,
        city: dealer.City._text,
        state: dealer.State._text,
        uuid: dealer.DealerCode._text || dealer.DealerID._text,
        distance: dealer.Distance._text,
        ProgramID: dealer.ProgramID._text,
        DealerID: dealer.DealerID._text,
        DealerCode: dealer.DealerCode._text,
      }))
    )
    .catch(() => []);
}

function getDealersDetroitTradingExchange(carSelection) {
  return fetch("/api/v2/NewCar/Ping", {
    method: "POST",
    headers: detroitHeaders,
    body: JSON.stringify({
      generatorId: DETROIT_GENERATOR_ID,
      password: DETROIT_PASSWORD,
      siteUrl: SITE_URL,
      make: carSelection.make,
      model: carSelection.model,
      postalCode: carSelection.postalCode,
    }),
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((result) =>
      result.dealers.map((dealer) => ({
        ...dealer,
        uuid: dealer.reservationID,
        _provider: "detroit",
      }))
    )
    .catch(() => []);
}

function sendToAutoweb(userInfo, carSelection, dealer) {
  const lead = {
    Vehicle: {
      Status: "New",
      Year: "2024",
      Make: carSelection.make,
      Model: carSelection.model,
    },
    Customer: {
      FirstName: userInfo.firstName,
      LastName: userInfo.lastName,
      EmailAddress: userInfo.email,
      HomePhone: userInfo.phone,
      ZipCode: carSelection.postalCode,
    },
    Dealers: {
      Dealer: {
        ProgramID: dealer.ProgramID,
        DealerID: dealer.DealerID,
        DealerCode: dealer.DealerCode,
      },
    },
    Provider: { ProviderID: AUTOWEB_PROVIDER_ID },
  };
  const content = _xml.js2xml(
    { lead },
    { compact: true, ignoreComment: false, spaces: 0 }
  );
  const body = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Post xmlns="http://www.autobytel.com/">
        ${content}
      </Post>
    </soap:Body>
  </soap:Envelope>`;
  return fetch("/autoweb-post", {
    method: "POST",
    headers: new Headers({ "Content-Type": "text/xml;charset=UTF-8" }),
    body: body,
    redirect: "follow",
  })
    .then((response) => response.text())
    .then((body) => _xml.xml2js(body, { compact: true, spaces: 4 }))
    .then((response) => {
      const error =
        response["soap:Envelope"]["soap:Body"].PostResponse.PostResult.Errors
          ?.Error?.Message?._text;
      if (error) {
        ReactGA.event("autoweb_submit_error", {
          uuid: dealer.uuid,
          name: dealer.name,
          error: error,
        });
      }
    })
    .catch((error) => console.log("error", error));
}

function sendToDetroit(userInfo, carSelection, dealer) {
  const requestOptions = {
    method: "POST",
    headers: detroitHeaders,
    body: JSON.stringify({
      generatorId: DETROIT_GENERATOR_ID,
      password: DETROIT_PASSWORD,
      siteUrl: SITE_URL,
      make: carSelection.make,
      model: carSelection.model,
      postalCode: carSelection.postalCode,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      phone: userInfo.phone,
      reservationID: dealer.reservationID,
    }),
    redirect: "follow",
  };

  return fetch("/api/v2/NewCar/Post", requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
}

export const ApiHandler = {
  getCloseDealers: async (carSelection) => {
    return Promise.all([
      getDealersAutoWeb(carSelection),
      getDealersDetroitTradingExchange(carSelection),
    ]).then((values) => [].concat(values[0], values[1]));
  },

  getCloseDealersSpread: async (carSelection) => {
    return Promise.all([
      getDealersAutoWeb(carSelection),
      getDealersDetroitTradingExchange(carSelection),
    ]).then((values) => ({
      autoweb: values[0],
      detroit: values[1],
      total: values[0].length + values[1].length,
      both: values[0].length > 0 && values[1].length > 0,
    }));
  },

  sendSelectedDealers: async (userInfo, carSelection, selectedDealers) => {
    ReactGA.event("selected_dealers_submitted", {
      number_of_dealers: selectedDealers.length,
    });
    Promise.all(
      selectedDealers.map((dealer) => {
        if (dealer._provider === "detroit") {
          ReactGA.event("detroit_selected_dealer_submitted", {
            uuid: dealer.uuid,
            name: dealer.name,
          });
          return sendToDetroit(userInfo, carSelection, dealer);
        }
        if (dealer._provider === "autoweb") {
          ReactGA.event("autoweb_selected_dealer_submitted", {
            uuid: dealer.uuid,
            name: dealer.name,
          });
          return sendToAutoweb(userInfo, carSelection, dealer);
        }
        return undefined;
      })
    );
  },

  getCloseDealersDummy: async () => {
    return fetch("/dealers_dummy_data.html")
      .then((response) => response.text())
      .then((text) => JSON.parse(text))
      .catch((error) => console.log("error", error));
  },

  sleep: async () => {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  },

  getCarImage: (make, model) => {
    return `/images/cars/24_${make.toLowerCase()}_${model
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll("-", "")
      .replaceAll(".", "")}.png`;
  },
};
