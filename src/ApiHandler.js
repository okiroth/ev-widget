const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");

const generatorId = "0000-5034";
const password = "5034AEZ";
const siteUrl = document.referrer;

export const ApiHandler = {
  getCloseDealers: async (data) => {
    const raw = JSON.stringify({
      generatorId,
      password,
      siteUrl,
      ...data,
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    return fetch("/api/v2/NewCar/Ping", requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log("error", error));
  },

  sendSelectedDealers: async (data) => {
    const raw = JSON.stringify({
      generatorId,
      password,
      siteUrl,
      ...data,
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    return fetch("/api/v2/NewCar/Post", requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log("error", error));
  },

  getCloseDealersDummy: async (data) => {
    return fetch("/newCarPing.html")
      .then((response) => response.text())
      .then((text) => JSON.parse(text))
      .catch((error) => console.log("error", error));
  },

  sleep: async () => {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  },
};
