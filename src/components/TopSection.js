import React from 'react';

const TopSection = ({ imageUrl }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <div className='title'>Find an electric vehicle near you</div>
        <div className='subtitle'>Tell us a little bit about yourself to receive offers from dealers near you</div>
      </div>
      <img src="/car.png" alt="" style={{ marginLeft: 'auto', maxWidth: "28%" }} />
    </div>
  );
};

export default TopSection;