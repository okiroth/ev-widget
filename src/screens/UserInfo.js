import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  InputLabel,
  Checkbox,
  FormControlLabel,
  ThemeProvider,
} from "@mui/material";
import { APP_THEME, STEPS } from "../App";
import { ApiHandler } from "../ApiHandler";

function UserInfo({ setShowStep, setUserInfo }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    { label: "Checkbox 1", checked: true },
    { label: "Checkbox 2", checked: true },
  ]);

  const handleCheckboxChange = (index) => (event) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index].checked = event.target.checked;
    setCheckboxes(newCheckboxes);
  };

  const handleSubmit = (event) => {
    if (!firstName || !lastName || !email) {
      setError("Please fill out all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    setUserInfo({ firstName, lastName, email, phone, checkboxes });
    // TODO replace sleep with the actual ping
    ApiHandler.sleep().then(() => {
      setShowStep(STEPS.SELECT_MAKE);
      setLoading(false);
    }); 
  };

  return (
    <ThemeProvider theme={APP_THEME}>
      <div className="container">
        <div className="row">
          <div className="column">
            <InputLabel className="label">First Name *</InputLabel>
            <TextField
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter") && handleSubmit()}
            />
          </div>
          <div className="column">
            <InputLabel className="label">Last Name *</InputLabel>
            <TextField
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter") && handleSubmit()}
            />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <InputLabel className="label">Email *</InputLabel>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter") && handleSubmit()}
            />
          </div>
          <div className="column">
            <InputLabel className="label">Phone</InputLabel>
            <TextField
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter") && handleSubmit()}
            />
          </div>
        </div>
        {checkboxes.map((checkbox, index) => (
          <div key={index} className="left">
            <FormControlLabel
              sx={{ fontWeight: 'bolder'}}
              control={
                <Checkbox
                  checked={checkbox.checked}
                  onChange={handleCheckboxChange(index)}
                />
              }
              label={checkbox.label}
            />
          </div>
        ))}

        <div className="row center">
          <div className="column">
            {error && <div className="error">{error}</div>}
            <Button
              className="button"
              variant="contained"
              color="primary"
              sx={{ fontWeight: "bold", padding: 1.5 }}
              onClick={handleSubmit}
              >
              {loading ? <div className="spinner"></div> : 'SUBMIT'}
            </Button>
          </div>
        </div>

        <div className="row center">
          <div className="column">
            <div className="disclaimer">
              By clicking submit, I authorize dealers that I select to contact
              me by phone or email. Carrier fees and charges may apply
            </div>
          </div>
        </div>

        <div className="row left">
          <div className="link" onClick={() => setShowStep(STEPS.SELECT_MAKE)}>
            Go back
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default UserInfo;
