import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  InputLabel,
  Checkbox,
  FormControlLabel,
  ThemeProvider,
} from "@mui/material";
import { APP_THEME, STEPS } from "../App";
import { ApiHandler } from "../ApiHandler";
import RevoLogo from "components/RevoLogo";

function UserInfo({
  setShowStep,
  userInfo,
  setUserInfo,
  selection,
  dealers,
  calculator,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (dealer) => (event) => {
    let aux = [];
    const uuid = dealer.uuid;
    if (userInfo.selected.includes(uuid)) {
      aux = userInfo.selected.filter((d) => d !== uuid);
    } else {
      aux = [...userInfo.selected, uuid];
    }
    setUserInfo({ ...userInfo, selected: aux });
  };

  useEffect(() => {
    setError("");
  }, [userInfo]);

  const handleSubmit = () => {
    const noDealers = userInfo.selected.length === 0;
    if (noDealers) {
      setError("Please select at least one dealership.");
      return;
    }
    if (
      !userInfo.firstName ||
      !userInfo.lastName ||
      !userInfo.email ||
      !userInfo.phone
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      setError("Invalid Email");
      return;
    }

    const phoneRegex =
      /^\+?1? ?\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(userInfo.phone)) {
      setError("Invalid Phone");
      return;
    }

    setLoading(true);
    setError("");

    ApiHandler.sendSelectedDealers(
      userInfo,
      selection,
      userInfo.selected.map((uuid) =>
        dealers.find((dealer) => dealer.uuid === uuid)
      )
    );

    // otherwise it looks strange the instant change
    ApiHandler.sleep().then(() => {
      setLoading(false);
      setShowStep(STEPS.SUBMITTED);
    });
  };

  return (
    <ThemeProvider theme={APP_THEME}>
      <div className={"container " + (calculator ? "" : "blue-step")}>
        {calculator && (
          <div>
            <div>
              <div className="title">
                Calculated your lease? Now find your car!
              </div>
              <div className="row-spacer" />
              <div className="subtitle">
                You’re in luck! We’ve found the following dealerships near you.
              </div>
            </div>
            <div className="row-spacer" />
          </div>
        )}
        <div className="row">
          <div className="column">
            <InputLabel className="label">First Name*</InputLabel>
            <TextField
              placeholder="Sam"
              value={userInfo.firstName}
              onChange={(e) =>
                setUserInfo({ ...userInfo, firstName: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="column">
            <InputLabel className="label">Last Name*</InputLabel>
            <TextField
              placeholder="Smith"
              value={userInfo.lastName}
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastName: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <InputLabel className="label">Email*</InputLabel>
            <TextField
              placeholder="sam.smith@gmail.com"
              type="email"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="column">
            <InputLabel className="label">Phone*</InputLabel>
            <TextField
              placeholder="123-456-7890"
              value={userInfo.phone}
              onChange={(e) =>
                setUserInfo({ ...userInfo, phone: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>
        {error && <div className="error">{error}</div>}

        <div className="row-spacer" />
        <div>
          <div className="subtitle">
            Select the dealerships you’d like to be contacted by:
          </div>
          <div className="row-spacer" />

          {dealers.map((dealer, index) => (
            <div key={index} className="left">
              <FormControlLabel
                sx={{
                  "& .MuiCheckbox-root": {
                    padding: "5px 0",
                  },
                  "& .MuiTypography-root": {
                    fontWeight: "bold",
                    fontFamily: "Gotham",
                  },
                }}
                control={
                  <Checkbox
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontFamily: "Gotham",
                      },
                    }}
                    checked={userInfo.selected.includes(dealer.uuid)}
                    onChange={handleCheckboxChange(dealer)}
                  />
                }
                label={`${dealer.name} (${dealer.distance} miles)`}
              />
            </div>
          ))}
        </div>
        <div className="row-spacer" />
        <div className="row">
          <div className="column">
            <Button
              className="submit-button"
              variant="contained"
              color="primary"
              sx={{ fontWeight: "bold", padding: 1.5 }}
              onClick={handleSubmit}
            >
              {loading ? <div className="spinner"></div> : "SUBMIT"}
            </Button>
          </div>
        </div>

        <div className="row">
          <div className="column">
            <div className="disclaimer">
              By completing this form, I consent to receive automated or
              pre-recorded telemarketing calls or texts to the number I provided
              by or on behalf of [business name], the brands, and the dealers I
              selected. I understand consent is not required as a condition of
              any services. Carrier charges may apply.
            </div>
          </div>
        </div>
        <div className="row-stretch">
          <div className="link" onClick={() => setShowStep(STEPS.SELECT_MAKE)}>
            Go back
          </div>
          <div>
            <RevoLogo />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default UserInfo;
