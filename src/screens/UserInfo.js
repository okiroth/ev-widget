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

function UserInfo({ setShowStep, setUserInfo, dealerships }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);

  const handleCheckboxChange = (index) => (event) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index].checked = event.target.checked;
    setCheckboxes(newCheckboxes);
  };

  useEffect(() => {
    setError("");
  }, [firstName, lastName, email, phone, checkboxes]);

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
    if (!firstName || !lastName || !email || !phone) {
      setError("Please fill out all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    setUserInfo({ firstName, lastName, email, phone, checkboxes });

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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="column">
            <InputLabel className="label">Last Name*</InputLabel>
            <TextField
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="column">
            <InputLabel className="label">Phone*</InputLabel>
            <TextField
              placeholder="123-456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
