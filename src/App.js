import React, { useState } from "react";
import "App.css";
import ScreenSelectMaker from "screens/SelectMake";
import ScreenUserInfo from "screens/UserInfo";
import ScreenSubmitted from "screens/Submitted";
import TopSection from "components/TopSection";
import Status from "screens/Status";
import { createTheme } from "@mui/material";
import LeftMenu from "screens/calculator/LeftMenu";
import TopSectionCalc from "screens/calculator/TopSectionCalc";
import ZipCode from "screens/calculator/ZipCode";

const isCalculator = window.location.href.includes("calculator");

const STEPS = {
  SELECT_MAKE: 0,
  USER_INFO: 1,
  SUBMITTED: 2,
};

const APP_THEME = createTheme({
  palette: {
    primary: {
      main: "#2081F3",
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
        },
      },
    },
  },
});

const INPUT_PLACEHOLDER = {
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: isCalculator ? "#2288FF" : "",
  },
  "& .MuiSelect-select .notranslate::after": "Select"
    ? {
        content: '"Select"',
        opacity: 0.42,
      }
    : {},
};

function App() {
  const [showStep, setShowStep] = useState(STEPS.SELECT_MAKE);
  const [selection, setSelection] = useState({
    make: "",
    model: "",
    postalCode: "",
  });
  const [lease, setLease] = useState({
    downPayment: 0,
    tradeInValue: 0,
    price: 0,
  });
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    selected: [],
  });
  const [dealers, setDealers] = useState([]);

  if (window.location.href.includes("status")) {
    return <Status />;
  }

  if (isCalculator) {
    document.title = "rEVo Leasing Calculator";
    return (
      <div className="calculator_wrapper">
        <LeftMenu
          setShowStep={setShowStep}
          setSelection={setSelection}
          selection={selection}
          lease={lease}
          setLease={setLease}
        />
        <div className="column">
          <TopSectionCalc showStep={showStep} lease={lease} />
          <div className="row-spacer" />
          <div className="steps_section">
            {showStep === STEPS.SELECT_MAKE && (
              <ZipCode
                setShowStep={setShowStep}
                selection={selection}
                setSelection={setSelection}
                setDealers={setDealers}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
              />
            )}
            {showStep === STEPS.USER_INFO && (
              <ScreenUserInfo
                calculator={true}
                selection={selection}
                setShowStep={setShowStep}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                dealers={dealers}
              />
            )}
            {showStep === STEPS.SUBMITTED && (
              <ScreenSubmitted
                setShowStep={setShowStep}
                selection={selection}
                setSelection={setSelection}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  document.title = "rEVo Find a Dealer";
  return (
    <div className="wrapper">
      <div className="top_section">
        <TopSection showStep={showStep} selection={selection} />
      </div>
      <div className="steps_section">
        {showStep === STEPS.SELECT_MAKE && (
          <ScreenSelectMaker
            setShowStep={setShowStep}
            setSelection={setSelection}
            selection={selection}
            setDealers={setDealers}
            setUserInfo={setUserInfo}
            userInfo={userInfo}
            dealers={dealers}
          />
        )}
        {showStep === STEPS.USER_INFO && (
          <ScreenUserInfo
            calculator={false}
            selection={selection}
            setShowStep={setShowStep}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            dealers={dealers}
          />
        )}
        {showStep === STEPS.SUBMITTED && (
          <ScreenSubmitted
            setShowStep={setShowStep}
            selection={selection}
            setSelection={setSelection}
          />
        )}
      </div>
    </div>
  );
}

export default App;
export { STEPS };
export { APP_THEME };
export { INPUT_PLACEHOLDER };
