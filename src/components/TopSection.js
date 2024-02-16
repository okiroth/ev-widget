import React, { useEffect, useState } from "react";

const TopSection = ({ selection }) => {
  const [imgSrc, setImageSrc] = useState("/car.png");

  useEffect(() => {
    if (selection.make && selection.model) {
      const make = selection.make.toLowerCase();
      const model = selection.model
        .toLowerCase()
        .replace(" ", "_")
        .replace("-", "")
        .replace(".", "");
      setImageSrc(`/images/cars/24_${make}_${model}.png`);
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
        onError={() => setImageSrc("/car.png")}
        src={imgSrc}
        alt=""
        style={{ marginLeft: "auto", maxWidth: "28%" }}
      />
    </div>
  );
};

export default TopSection;
