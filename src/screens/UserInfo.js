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

function UserInfo({ setShowStep, setUserInfo }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
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
    setError("");
    setUserInfo({ firstName, lastName, email, phone, checkboxes });
  };

  return (
    <ThemeProvider theme={APP_THEME}>
      <div className="container">
        <div className="row">
          <div className="column">
            <InputLabel>First Name *</InputLabel>
            <TextField
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="column">
            <InputLabel>Last Name *</InputLabel>
            <TextField
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <InputLabel>Email *</InputLabel>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="column">
            <InputLabel>Phone</InputLabel>
            <TextField
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        {error && <Typography color="error">{error}</Typography>}
        {checkboxes.map((checkbox, index) => (
          <div className="row left">
            <FormControlLabel
              sx={{ fontWeight: 'bolder'}}
              key={index}
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
            <Button
              className="button"
              variant="contained"
              color="primary"
              sx={{ fontWeight: "bold", padding: 1.5 }}
              onClick={handleSubmit}
            >
              SUBMIT
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
          <div className="link" onClick={() => setShowStep(STEPS.SELECT_MAKER)}>
            Go back
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default UserInfo;
