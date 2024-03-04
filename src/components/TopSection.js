import React, { useEffect, useState } from "react";
import { ApiHandler } from "ApiHandler";

const TopSection = ({ selection }) => {
  const [imgSrc, setImageSrc] = useState("/car.png");

  useEffect(() => {
    if (selection.model) {
      setImageSrc(ApiHandler.getCarImage(selection.make, selection.model));
    }
  }, [selection.model]);

  return (
    <div className="row middle">
      <div>
        <div className="title">Find an electric vehicle near you</div>
        <div className="row-spacer" />
        <div className="subtitle">
          Tell us a little bit about yourself to receive offers from dealers
          near you
        </div>
      </div>
      <div className="car_image">
        <img onError={() => setImageSrc("/car.png")} src={imgSrc} alt="" />
      </div>
    </div>
  );
};

export default TopSection;
