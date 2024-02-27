import { useState } from "react";
import { CARS_DATA_ARRAY } from "data/2024 EV Data - EV Data";
import { ApiHandler } from "ApiHandler";

export default function CheckImages() {
  const [errors, setErrors] = useState([]);

  return (
    <div>
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
