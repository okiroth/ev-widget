import { useEffect, useState } from "react";
import { CARS_DATA_ARRAY } from "data/2024 EV Data - EV Data";
import { ApiHandler } from "ApiHandler";

export default function Status() {
  const [errors, setErrors] = useState([]);
  const [errors2, setErrors2] = useState([]);
  const [searched, setSearched] = useState(0);
  const [found, setFound] = useState(0);

  const ZIP_CODES = ["10001", "48201", "90210", "94115", "2138"];

  useEffect(() => {
    ZIP_CODES.forEach((zip) => {
      CARS_DATA_ARRAY.forEach((car) => {
        setSearched((prev) => prev + 1);
        ApiHandler.getCloseDealersSpread({
          make: car.make,
          model: car.model,
          postalCode: zip,
        }).then((res) => {
          if (res.length > 0) {
            setFound((prev) => prev + 1);
          }
          setErrors2((prev) => [
            ...prev,
            `[${zip}] ${res.autoweb.length} | ${res.detroit.length} (${
              car.make
            } ${car.model}) ${res.total > 0 ? "✅" : ""}
            ${res.both ? "✅✅✅✅" : ""}`,
          ]);
        });
      });
    });
  }, []);

  return (
    <div>
      <h1>Dealers</h1>
      <p>Searched: {searched}</p>
      <p>Found: {found}</p>
      {errors2.length > 0 && (
        <div>
          <ul>
            {errors2.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}
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
