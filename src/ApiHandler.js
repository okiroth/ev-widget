export const ApiHandler = {

  newCarPing: async (data) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      generatorId: "0000-0001",
      password: "GHSKKDS",
      siteUrl: "wwww.nerdwallet.com",
      ...data,
    });

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch(
      "https://test.detroittradingexchange.com/api/v2/NewCar/Ping",
      requestOptions
    ) 
      .then((response) => response.text())
      .then((text) => JSON.parse(text))
      .then(json => console.log(json))
      .catch((error) => console.log("error", error));
  },

  newCarPingDummy: async (data) => {
    return fetch("/newCarPing.html") 
      .then((response) => response.text())
      .then((text) => JSON.parse(text))
      .catch((error) => console.log("error", error));
  },

  sleep: async () => {
    return new Promise(resolve => setTimeout(resolve, 3000));
  },

};
