import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

function UserInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [checkboxes, setCheckboxes] = useState([
    { label: "Checkbox 1", checked: false },
    { label: "Checkbox 2", checked: false },
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
    console.log("Form submitted:", {
      firstName,
      lastName,
      email,
      phone,
      checkboxes,
    });
  };

  return (
    <div>
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
        
      </div>
    </div>
  );
}

export default UserInfo;
