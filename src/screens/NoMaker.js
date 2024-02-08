import React from 'react';
import ScreenSelectMaker from './SelectMaker';

function NotMaker({ setShowStep }) {

  return (
    <div>
      <ScreenSelectMaker setShowStep={setShowStep} />
      
      <h3>We couldn’t find any nearby dealerships for that Make and Model. Please update the vehicle or try another zip code.</h3>
    </div>

  );
}

export default NotMaker;