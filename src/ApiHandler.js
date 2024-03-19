import {
  AUTOWEB_PROVIDER_ID,
  DETROIT_GENERATOR_ID,
  DETROIT_PASSWORD,
  ZIPS_LOOKOUT_RANGE,
  SITE_URL,
  ZIPS_LOOKOUT_STEP,
} from "Settings";

const _xml = require("xml-js");
const dataLayer = window.dataLayer;

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
      Address1: userInfo.address,
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
          ?.Error?.Message?._text || false;
      const track = {
        event: "autoweb_submit",
        user: userInfo,
        selection: carSelection,
        dealer: dealer,
        api_response: response,
        error: error,
      };
      dataLayer.push(track);
      console.log(track);
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
      street: userInfo.address,
      reservationID: dealer.reservationID,
    }),
    redirect: "follow",
  };

  return fetch("/api/v2/NewCar/Post", requestOptions)
    .then((response) => response.json())
    .then((response) => {
      const track = {
        event: "detroit_submit",
        selection: carSelection,
        user: userInfo,
        dealer: dealer,
        api_response: response,
        error: response.errorMessage || false,
      };
      dataLayer.push(track);
      console.log(track);
    })
    .catch((error) => console.log("error", error));
}

export let fetchWatcher = { key: undefined, value: 0 };

function stopFetchWatcher(data, carSelection) {
  const keyCheck =
    fetchWatcher.key === `${carSelection.make}${carSelection.model}`;

  let done = false;

  if (!keyCheck) return done;

  fetchWatcher.value++;

  const hasData = data.length > 0;
  const limitReached =
    fetchWatcher.value >= (ZIPS_LOOKOUT_RANGE / ZIPS_LOOKOUT_STEP) * 4;

  if (hasData || limitReached) {
    done = true;
  }

  console.log({
    p: carSelection.postalCode,
    f: fetchWatcher.value,
    done,
    limitReached,
    data: data.length,
  });
  return done;
}

async function getDealersAutoWeb(carSelection, force = false) {
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

  // If there is only one dealer, it will not be an array, blame the API...
  if (
    data?.Dealers?.Dealer !== undefined &&
    data?.Dealers?.Dealer.length === undefined
  ) {
    data.Dealers.Dealer = [data?.Dealers?.Dealer];
  }

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
  return new Promise((resolve) => {
    if (stopFetchWatcher(cleanData, carSelection) || force === true) {
      resolve(cleanData);
    }
  });
}

async function getDealersDetroit(carSelection, force = false) {
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
  return new Promise((resolve) => {
    if (stopFetchWatcher(cleanData, carSelection) || force === true) {
      resolve(cleanData);
    }
  });
}

export const ApiHandler = {
  getCloseDealers: (carSelection) => {
    const num = Number(carSelection.postalCode);
    const zips = [num];
    for (
      let i = num - ZIPS_LOOKOUT_RANGE;
      i <= num + ZIPS_LOOKOUT_RANGE;
      i += ZIPS_LOOKOUT_STEP
    ) {
      if (zips.includes(i)) continue;
      zips.push(i);
    }
    zips.sort((a, b) => Math.abs(num - a) - Math.abs(num - b));
    console.log({ zips });

    const queries = [];
    fetchWatcher = {
      key: `${carSelection.make}${carSelection.model}`,
      value: 0,
    };
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
      getDealersAutoWeb(carSelection, true),
      getDealersDetroit(carSelection, true),
    ]);
  },

  sendSelectedDealers: async (userInfo, carSelection, selectedDealers) => {
    Promise.all(
      selectedDealers.map((dealer) => {
        if (dealer._provider === "detroit") {
          return sendToDetroit(userInfo, carSelection, dealer);
        }
        if (dealer._provider === "autoweb") {
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
