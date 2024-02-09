import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  Button,
  InputLabel,
  TextField,
  FormHelperText,
  ThemeProvider,
} from "@mui/material";
import { APP_THEME, STEPS, INPUT_PLACEHOLDER } from "../App";
import { CARS_DATA } from "../data/cars";
import { ApiHandler } from "../ApiHandler";

function SelectMake({ setShowStep, setSelection, setDealerships }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [errorpostalCode, setErrorPostalCode] = useState(false);

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  const [cars, setCars] = useState([]);

  const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

  // The CSV is the direct download from
  // https://docs.google.com/spreadsheets/d/1Xifx_6hkbYCXAYAR0IWlZEn40fi56a9k8q8_stU6pr4/edit#gid=0
  // and paste it into the CARS_DATA variable
  //
  // !!!!! REMOVE THE FIRST LINE of the CSV !!!!!
  //
  //
  useEffect(() => {
    const lines = CARS_DATA.split("\n");
    lines.forEach((line) => {
      const [make, model] = line.split(",");
      setCars((prev) => [...prev, { make, model }]);
    });
  }, []);

  // This checks for unique makes
  useEffect(() => {
    const uniqueMakes = [...new Set(cars.map((car) => car.make))].map(
      (make) => ({ value: make, label: make })
    );
    setMakes(uniqueMakes);
  }, [cars]);

  // This checks for unique models after the make is selected
  useEffect(() => {
    const uniqueModels = [
      ...new Set(
        cars.filter((car) => car.make === make).map((car) => car.model)
      ),
    ].map((model) => ({ value: model, label: model }));
    setModels(uniqueModels);
  }, [cars, make]);

  const handleSubmit = () => {
    if (make && model && postalCode) {
      if (postalCodeRegex.test(postalCode)) {
        setErrorPostalCode(false);
        setSelection({ make, model, postalCode });

        // TODO replace sleep with the actual ping
        ApiHandler.sleep({make, model, postalCode}).then(() => {
          setShowStep(STEPS.USER_INFO);
        }); 

      } else {
        setErrorPostalCode(true);
      }
    }
  };

  return (
    <ThemeProvider theme={APP_THEME}>
      <div className="container">
        <div className="row">
          <div className="column">
            <InputLabel>Make</InputLabel>
            <Select
              sx={INPUT_PLACEHOLDER}
              value={make}
              onChange={(e) => setMake(e.target.value)}
            >
              {makes.map((make, index) => (
                <MenuItem key={index} value={make.value}>
                  {make.label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="column">
            <InputLabel>Model</InputLabel>
            <Select
              sx={INPUT_PLACEHOLDER}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {models.map((model, index) => (
                <MenuItem key={index} value={model.value}>
                  {model.label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="column">
            <InputLabel>Zip Code</InputLabel>
            <TextField
              placeholder="12345"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {errorpostalCode && <FormHelperText>Invalid Zip Code</FormHelperText>}
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

export default SelectMake;
