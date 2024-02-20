import React, { useEffect, useState } from "react";
import { ApiHandler } from "../ApiHandler";

const TopSection = ({ selection }) => {
  const [imgSrc, setImageSrc] = useState("/car.png");

  useEffect(() => {
    if (selection.make && selection.model) {
      setImageSrc(ApiHandler.getCarImage(selection.make, selection.model));
    }
  }, [selection]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>
        <div className="title">Find an electric vehicle near you</div>
        <div className="subtitle">
          Tell us a little bit about yourself to receive offers from dealers
          near you
        </div>
      </div>
      <img
        className="top_section_image"
        onError={() => setImageSrc("/car.png")}
        src={imgSrc}
        alt=""
      />
    </div>
  );
};

export default TopSection;
