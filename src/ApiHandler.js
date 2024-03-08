var convert = require("xml-js");

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

const generatorId = "0000-5034";
const password =
  "ZDn3PkmeKsHoRjcaSNujKdRh9JqZeUW8+DJ3Jbil8+FSJ8snaadT8oj6JV3BqtJlMOQXNSIkpI6nu1CDwgNmCg==";
const siteUrl = document.referrer || "https://www.nerdwallet.com/";

function getDealersAutoWeb(data) {
  return fetch("/autoweb-ping", {
    body: new URLSearchParams({
      providerID: 1234, //TODO replace when we have the real providerID
      year: "2024",
      make: data.make,
      model: data.model,
      trim: "",
      zipCode: data.postalCode,
    }).toString(),
    method: "POST",
    headers: autowebHeaders,
  })
    .then((response) => response.text())
    .then(
      (str) => convert.xml2js(str, { compact: true, spaces: 4 }).PingResult
    );
}

function getDealersDetroitTradingExchange(data) {
  const requestOptions = {
    method: "POST",
    headers: detroitHeaders,
    body: JSON.stringify({
      generatorId,
      password,
      siteUrl,
      ...data,
    }),
    redirect: "follow",
  };
  return fetch("/api/v2/NewCar/Ping", requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
}

export const ApiHandler = {
  getCloseDealers: async (data) => {
    return Promise.all([
      getDealersAutoWeb(data),
      getDealersDetroitTradingExchange(data),
    ]).then((values) => {
      // TODO combine the two results, or use one or the other
      // console.log(values);
      return values[1];
    });
  },

  sendSelectedDealers: async (data) => {
    const requestOptions = {
      method: "POST",
      headers: detroitHeaders,
      body: JSON.stringify({
        generatorId,
        password,
        siteUrl,
        ...data,
      }),
      redirect: "follow",
    };
    return fetch("/api/v2/NewCar/Post", requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log("error", error));
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
