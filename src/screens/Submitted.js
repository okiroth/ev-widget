import React, { useEffect, useState } from "react";
import { APP_THEME, STEPS } from "../App";
import { ThemeProvider } from "@mui/material";

const ImageGrid = ({ selection, setSelection, setShowStep }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages([
      {
        url: "images/kia_ev6.png",
        subtitle: "Kia EV6",
        selection: { make: "Kia", model: "EV6" },
      },
      {
        url: "images/nissan_leaf.png",
        subtitle: "Nissan Leaf",
        selection: { make: "Nissan", model: "Leaf" },
      },
    ]);
  }, [selection]);

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
        <div className="image-grid">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img src={image.url} alt={image.subtitle} />
              <p>{image.subtitle}</p>
              <div
                className="link"
                onClick={() => {
                  setSelection({ ...selection, ...image.selection });
                  setShowStep(STEPS.SELECT_MAKE);
                }}
              >
                <strong>See Nearby Dealerships</strong>
              </div>
            </div>
          ))}
        </div>
        <div className="row-spacer"></div>
        <div className="row-spacer"></div>
        <div className="row left">
          <div className="link" onClick={() => setShowStep(STEPS.USER_INFO)}>
            Go back
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ImageGrid;
