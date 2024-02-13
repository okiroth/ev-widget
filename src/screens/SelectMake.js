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

function SelectMake({ setShowStep, setSelection, selection, setDealerships }) {
  const [make, setMake] = useState(selection.make || "");
  const [model, setModel] = useState(selection.model || "");
  const [postalCode, setPostalCode] = useState(selection.postalCode || "");
  const [errorpostalCode, setErrorPostalCode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [cars, setCars] = useState([]);
  const [noDealers, setNoDealers] = useState(false);

  const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

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

  useEffect(() => {
    setError("");
    setNoDealers(false);
  }, [make, model, postalCode]);

  const handleSubmit = () => {
    if (!make || !model) {
      setError("Please fill out all required fields.");
      return;
    }
    setError("");
    if (!postalCodeRegex.test(postalCode)) {
      setErrorPostalCode(true);
      return;
    }

    setLoading(true);

    setError("");
    setErrorPostalCode(false);
    setSelection({ make, model, postalCode });

    ApiHandler.newCarPing({ make, model, postalCode }).then((res) => {
      if (res.success) {
        setDealerships(res.dealers);
        setShowStep(STEPS.USER_INFO);
      } else {
        setNoDealers(true);
      }
      setLoading(false);
    });
  };

  return (
    <ThemeProvider theme={APP_THEME}>
      <div className="container blue-step">
        <div className="row">
          <div className="column">
            <InputLabel className="label">Make</InputLabel>
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
            <InputLabel className="label">Model</InputLabel>
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
            <InputLabel className="label">Zip Code</InputLabel>
            <TextField
              placeholder="12345"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {errorpostalCode && (
              <FormHelperText>Invalid Zip Code</FormHelperText>
            )}
          </div>
        </div>
        <div className="row-spacer"></div>
        <div className="row center">
          <div className="column">
            {error && <div className="error">{error}</div>}
            <Button
              className="submit-button"
              variant="contained"
              color="primary"
              sx={{ fontWeight: "bold", padding: 1.5 }}
              onClick={handleSubmit}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                "SHOW DEALERSHIPS NEAR YOU"
              )}
            </Button>
          </div>
        </div>
        <div className="row-spacer"></div>
        {noDealers && (
          <div className="row center subtitle">
            We couldn’t find any nearby dealerships for that Make and Model.
            Please update the vehicle or try another zip code.
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default SelectMake;
