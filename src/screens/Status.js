import { useEffect, useState } from "react";
// import { CARS_DATA_ARRAY_SMALL } from "data/2024 EV Data - EV Data_Small";
import { CARS_DATA_ARRAY } from "data/2024 EV Data - EV Data";
import { ApiHandler } from "ApiHandler";

export default function Status() {
  const [errors, setErrors] = useState([]);
  const [foundCars, setFoundCars] = useState([]);
  const [foundBy, setFoundBy] = useState({});
  const [searched, setSearched] = useState(0);
  const [foundDetroit, setFoundDetroit] = useState(0);
  const [foundAutoweb, setFoundAutoweb] = useState(0);

  const ZIP_CODES = ["10001", "48201", "90210", "94115", "02138"];

  useEffect(() => {
    ZIP_CODES.forEach((zip) => {
      CARS_DATA_ARRAY.forEach(({ make, model }) => {
        ApiHandler.getCloseDealersSpread({ make, model, postalCode: zip }).then(
          ([autoweb, detroit]) => {
            const key = `${make}${model}`;
            setFoundBy((prev) => ({
              ...prev,
              [key]: { ...prev[key], [zip]: [autoweb.length, detroit.length] },
            }));

            setFoundCars((prev) => {
              for (let ii = 0; ii < prev.length; ii++) {
                if (prev[ii][0] === `${zip}${make}${model}`) {
                  return prev;
                }
              }
              return [
                ...prev,
                [
                  `${zip}${make}${model}`,
                  { zip, make, model },
                  autoweb,
                  detroit,
                ],
              ];
            });
          }
        );
      });
    });
  }, []);

  useEffect(() => {
    let autowebCounter = 0;
    let detroitCounter = 0;
    foundCars.forEach(([key, { zip, make, model }, autoweb, detroit]) => {
      autowebCounter += autoweb.length;
      detroitCounter += detroit.length;
    });
    setFoundAutoweb(autowebCounter);
    setFoundDetroit(detroitCounter);
    setSearched(Object.keys(foundCars).length);
  }, [foundCars]);

  return (
    <div>
      <h1>Dealers</h1>
      <p>Searched: {searched}</p>
      <p>Autoweb: {foundAutoweb}</p>
      <p>Detroit: {foundDetroit}</p>
      {Object.entries(foundBy).map(([car, zips]) => (
        <div className="steps_section" key={car}>
          <h3>{car}</h3>
          {Object.entries(zips).map(([zip, [autoweb, detroit]]) => (
            <div className="row left" key={zip}>
              <div style={{ width: 70 }}>{zip}:</div>
              <div>
                [{autoweb}, {detroit}]
              </div>
            </div>
          ))}
        </div>
      ))}
      <div>
        <ul>
          {foundCars.map(([key, { zip, make, model }, autoweb, detroit]) => (
            <div className="row left" key={key}>
              <div style={{ width: 80 }}>[{zip}]</div>
              <div style={{ width: 50 }}>
                {autoweb.length} | {detroit.length}
              </div>
              <div>
                {make} {model}
              </div>
              <div>{autoweb.length || detroit.length > 0 ? "✅" : ""}</div>
            </div>
          ))}
        </ul>
      </div>
      <br />
      <br />
      <h1>Check Images</h1>
      {errors.length > 0 && (
        <div>
          <h2>Errors</h2>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="image-grid">
        {CARS_DATA_ARRAY.map((car, idx) => (
          <div key={idx} className="image-item">
            <img
              style={{ width: "100px" }}
              src={ApiHandler.getCarImage(car.make, car.model)}
              alt=""
              onError={() => {
                setErrors((prev) => [
                  ...prev,
                  `${car.make} ${car.model}: ${ApiHandler.getCarImage(
                    car.make,
                    car.model
                  )}`,
                ]);
              }}
            />
            <p>
              {car.make} {car.model}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
