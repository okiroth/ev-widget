import ReactGA from "react-ga4";
import { track } from "@vercel/analytics";
import {
  AUTOWEB_PROVIDER_ID,
  DETROIT_GENERATOR_ID,
  DETROIT_PASSWORD,
  MAX_PING_REQUEST,
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
      track("autoweb_submit", {
        email: userInfo.email,
        uuid: dealer.uuid,
        name: dealer.name,
        error: error,
      });
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
    .then((result) => {
      track("detroit_submit", {
        email: userInfo.email,
        uuid: dealer.uuid,
        name: dealer.name,
        error: result.errorMessage,
      });
      if (result.errorMessage) {
        ReactGA.event("detroit_submit_error", {
          uuid: dealer.uuid,
          name: dealer.name,
          error: result.errorMessage,
        });
      }
    })
    .catch((error) => console.log("error", error));
}

let fetchCounter = 0;

async function getDealersAutoWeb(carSelection) {
  const res = await fetch("/autoweb-ping", {
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
  });
  const str = await res.text();
  const data = await _xml.xml2js(str, { compact: true, spaces: 4 }).PingResult;
  const cleanData = (data?.Dealers?.Dealer || []).map((dealer) => ({
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
  }));
  fetchCounter++;
  return new Promise((resolve) => {
    if (cleanData.length > 0 || fetchCounter >= MAX_PING_REQUEST) {
      resolve(cleanData);
    }
  });
}

async function getDealersDetroit(carSelection) {
  const res = await fetch("/api/v2/NewCar/Ping", {
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
  });
  const data = await res.json();
  const cleanData = (data?.dealers || []).map((dealer) => ({
    ...dealer,
    uuid: dealer.reservationID,
    _provider: "detroit",
  }));
  fetchCounter++;
  return new Promise((resolve) => {
    if (cleanData.length > 0 || fetchCounter >= MAX_PING_REQUEST) {
      resolve(cleanData);
    }
  });
}

export const ApiHandler = {
  getCloseDealers: (carSelection) => {
    const num = Number(carSelection.postalCode);
    const zips = [];
    for (let i = num - MAX_PING_REQUEST; i <= num + MAX_PING_REQUEST; i++) {
      zips.push(i);
    }
    zips.sort((a, b) => Math.abs(num - a) - Math.abs(num - b));

    const queries = [];
    fetchCounter = 0;
    zips.forEach((zip) => {
      const nZip = zip.toString().padStart(5, "0");
      queries.push(
        getDealersAutoWeb({ ...carSelection, postalCode: nZip }),
        getDealersDetroit({ ...carSelection, postalCode: nZip })
      );
    });
    return Promise.race(queries);
  },

  getCloseDealersSpread: async (carSelection) => {
    return Promise.all([
      getDealersAutoWeb(carSelection),
      getDealersDetroit(carSelection),
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
