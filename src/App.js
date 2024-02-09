import React, { useState } from 'react';
import './App.css';
import ScreenSelectMaker from './screens/SelectMaker';
import ScreenNoMaker from './screens/NoMaker';
import ScreenUserInfo from './screens/UserInfo';
import ScreenSubmitted from './screens/Submitted';
import TopSection from './components/TopSection';
import { createTheme } from '@mui/material';


const STEPS = {
  'SELECT_MAKER': 0,
  'NO_MAKER': 1,
  'USER_INFO': 2,
  'SUBMITTED': 3
}

const APP_THEME = createTheme({
  palette: {
    primary: {
      main: '#2081F3',
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
        },
      },
    },
  },
});

const INPUT_PLACEHOLDER = {
  '& .MuiSelect-select .notranslate::after': 'Select'
      ? {
          content: '"Select"',
          opacity: 0.42,
        }
      : {},
}

function App() {
  const [showStep, setShowStep] = useState(STEPS.SELECT_MAKER);
  const [selection, setSelection] = useState({});
  const [userInfo, setUserInfo] = useState({});

  return (
    <div className="wrapper">
      <div className="top_section">
        <TopSection />
      </div>
      <div className="steps_section">
        {showStep === STEPS.SELECT_MAKER && <ScreenSelectMaker setShowStep={setShowStep} setSelection={setSelection} />}
        {showStep === STEPS.NO_MAKER && <ScreenNoMaker setShowStep={setShowStep}  />}
        {showStep === STEPS.USER_INFO && <ScreenUserInfo setShowStep={setShowStep} setUserInfo={setUserInfo}/>}
        {showStep === STEPS.SUBMITTED && <ScreenSubmitted setShowStep={setShowStep} />}
      </div>
    </div>
  );
}

export default App;
export { STEPS };
export { APP_THEME };
export { INPUT_PLACEHOLDER };
