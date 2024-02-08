import React from 'react';

const TopSection = ({ imageUrl }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <h1>Find an electric vehicle near you</h1>
        <p>Tell us a little bit about yourself to receive offers from dealers near you</p>
      </div>
      <img src="/car.png" alt="" style={{ marginLeft: 'auto', maxWidth: "33%" }} />
    </div>
  );
};

export default TopSection;