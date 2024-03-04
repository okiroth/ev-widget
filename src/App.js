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
    selected: [],
  });
  const [dealers, setDealers] = useState([]);

  if (window.location.href.includes("status")) {
    return <Status />;
  }

  if (window.location.href.includes("calculator")) {
    return (
      <div className="calculator_wrapper">
        <LeftMenu
          setShowStep={setShowStep}
          setSelection={setSelection}
          selection={selection}
          lease={lease}
          setLease={setLease}
        />
        <div className="calc-content column">
          <TopSectionCalc lease={lease} />
          <div className="row-spacer" />
          <div className="steps_section">
            {showStep === STEPS.SELECT_MAKE && (
              <ZipCode
                setShowStep={setShowStep}
                selection={selection}
                setSelection={setSelection}
                setDealers={setDealers}
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

  return (
    <div className="wrapper">
      <div className="top_section">
        <TopSection selection={selection} />
      </div>
      <div className="steps_section">
        {showStep === STEPS.SELECT_MAKE && (
          <ScreenSelectMaker
            setShowStep={setShowStep}
            setSelection={setSelection}
            selection={selection}
            setDealers={setDealers}
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
