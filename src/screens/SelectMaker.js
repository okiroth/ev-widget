import React, { useState } from "react";
import {
  Select,
  MenuItem,
  Button,
  InputLabel,
  TextField,
  FormHelperText,
  ThemeProvider,
} from "@mui/material";
import { APP_THEME, STEPS } from "../App";

function SelectMaker({ setShowStep, setSelection }) {
  const [maker, setMaker] = useState("");
  const [model, setModel] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [errorZipcode, setErrorZipcode] = useState(false);

  const zipCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

  const handleSubmit = () => {
    if (maker && model && zipcode) {
      if (zipCodeRegex.test(zipcode)) {
        setErrorZipcode(false);
        setShowStep(STEPS.USER_INFO);
        setSelection({ maker, model, zipcode });
      } else {
        setErrorZipcode(true);
      }
    }
  };

  return (
    <ThemeProvider theme={APP_THEME}>
      <div className="container">
        <div className="row">
          <div className="column">
            <InputLabel>Maker</InputLabel>
            <Select sx={{ backgroundColor: 'white' }} value={maker} onChange={(e) => setMaker(e.target.value)}>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </div>
          <div className="column">
            <InputLabel>Model</InputLabel>
            <Select sx={{ backgroundColor: 'white' }} value={model} onChange={(e) => setModel(e.target.value)}>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </div>
          <div className="column">
            <InputLabel>Zip Code</InputLabel>
            <TextField
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            />
            {errorZipcode && <FormHelperText>Invalid Zip Code</FormHelperText>}
          </div>
        </div>
        <div className="row center">
          <div className="column">
            <Button
              className="button"
              variant="contained"
              color="primary"
              sx={{ fontWeight: "bold", padding: 1.5 }}
              onClick={handleSubmit}
            >
              SHOW DEALERSHIPS NEAR YOU
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SelectMaker;
