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

function UserInfo({ setShowStep, userInfo, setUserInfo, dealerships }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);

  const handleCheckboxChange = (index) => (event) => {
    const newCheckboxes = [...userInfo.selected];
    newCheckboxes[index].checked = event.target.checked;
    setUserInfo({ ...userInfo, selected: newCheckboxes });
  };

  useEffect(() => {
    setError("");
  }, [userInfo]);

  useEffect(() => {
    setCheckboxes(
      dealerships.map((dealer) => ({
        label: `${dealer.name} (${dealer.distance} miles)`,
        value: dealer.reservationID,
        checked: false,
      }))
    );
  }, [dealerships]);

  const handleSubmit = (event) => {
    const noDealers =
      checkboxes.filter((checkbox) => checkbox.checked).length === 0;
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
    setLoading(true);
    setError("");

    // TODO replace sleep with the actual ping
    ApiHandler.sleep().then(() => {
      setShowStep(STEPS.SUBMITTED);
      setLoading(false);
    });
  };

  return (
    <ThemeProvider theme={APP_THEME}>
      <div className="container blue-step">
        <div className="row">
          <div className="column">
            <InputLabel className="label">First Name*</InputLabel>
            <TextField
              placeholder="Jhon"
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
              placeholder="jsmith@gmail.com"
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

        <div className="row-spacer"></div>
        <div className="row-spacer">
          <div className="subtitle" style={{ marginBottom: 10 }}>
            We’ve found the following qualified dealerships near you:
          </div>
          {checkboxes.map((checkbox, index) => (
            <div key={index} className="left">
              <FormControlLabel
                sx={{
                  "& .MuiCheckbox-root": {
                    padding: "5px 0",
                  },
                  "& .MuiTypography-root": {
                    fontWeight: "bold",
                  },
                }}
                control={
                  <Checkbox
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: "2rem",
                      },
                    }}
                    checked={checkbox.checked}
                    onChange={handleCheckboxChange(index)}
                  />
                }
                label={checkbox.label}
              />
            </div>
          ))}
        </div>
        <div className="row-spacer"></div>
        <div className="row center">
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

        <div className="row center">
          <div className="column">
            <div className="disclaimer">
              By clicking submit, I authorize dealers that I select to contact
              me by phone or email. Carrier fees and charges may apply
            </div>
            <div className="row-spacer"></div>
            <div
              className="link"
              onClick={() => setShowStep(STEPS.SELECT_MAKE)}
            >
              Go back
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default UserInfo;
