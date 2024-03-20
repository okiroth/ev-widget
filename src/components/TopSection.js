import React, { useEffect, useState } from "react";
import { ApiHandler } from "ApiHandler";
import { STEPS } from "App";

const TopSection = ({ showStep, selection }) => {
  const [imgSrc, setImageSrc] = useState("/car.png");

  const stepText = {
    [STEPS.SELECT_MAKE]:
      "Tell us where you live and which EV you're interested in learning more about",
    [STEPS.USER_INFO]:
      "Share your contact information to receive exclusive offers from dealers near you",
    [STEPS.SUBMITTED]: "Thank you!",
  };

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
        <div className="subtitle">{stepText[showStep]}</div>
      </div>
      <div className="car_image">
        <img onError={() => setImageSrc("/car.png")} src={imgSrc} alt="" />
      </div>
    </div>
  );
};

export default TopSection;
