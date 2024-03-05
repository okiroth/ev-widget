import React, { useEffect, useState } from "react";
import { APP_THEME, STEPS } from "App";
import { ThemeProvider } from "@mui/material";
import { CARS_DATA_ARRAY } from "data/2024 EV Data - EV Data";
import { ApiHandler } from "ApiHandler";

const ImageGrid = ({ selection, setSelection, setShowStep }) => {
  const [images, setImages] = useState([]);

  const getRandomCar = () => {
    const randomIndex = Math.floor(Math.random() * CARS_DATA_ARRAY.length);
    const { make, model } = CARS_DATA_ARRAY[randomIndex];
    return { make, model };
  };

  useEffect(() => {
    setImages([getRandomCar(), getRandomCar()]);
  }, []);

  return (
    <ThemeProvider theme={APP_THEME}>
      <div className="container">
        <div className="title">
          A qualified dealership will be in contact with you soon.
        </div>
        <div className="subtitle">
          Meanwhile, here are more electric vehicles you may like
        </div>
      </div>
      <div className="container">
        <div className="cars_grid">
          {images.map((car, idx) => (
            <div key={idx} className="car_box">
              <div className="car_image_small">
                <img src={ApiHandler.getCarImage(car.make, car.model)} alt="" />
              </div>
              <p>
                {car.make} {car.model}
              </p>
              <div
                className="link"
                onClick={() => {
                  setSelection({
                    make: car.make,
                    model: car.model,
                    postalCode: selection.postalCode,
                  });
                  setShowStep(STEPS.SELECT_MAKE);
                }}
              >
                <strong>See Nearby Dealerships</strong>
              </div>
            </div>
          ))}
        </div>
        <div className="row-spacer"></div>
        <div className="row-stretch">
          <div className="link" onClick={() => setShowStep(STEPS.USER_INFO)}>
            Go back
          </div>
          <div>
            <a target="_blank" className="link" href="wwww.tryrevo.com">
              tryrevo.com
            </a>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ImageGrid;
