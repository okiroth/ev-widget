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
import { APP_THEME, STEPS, INPUT_PLACEHOLDER } from "App";
import { CARS_DATA_ARRAY } from "data/2024 EV Data - EV Data";
import { ApiHandler } from "ApiHandler";
import RevoLogo from "components/RevoLogo";

function SelectMake({ setShowStep, setSelection, selection, setDealers }) {
  const [errorpostalCode, setErrorPostalCode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([
    { value: "", label: "Select Make first" },
  ]);
  const [noDealers, setNoDealers] = useState(false);

  const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

  useEffect(() => {
    const uniqueMakes = [
      ...new Set(CARS_DATA_ARRAY.map((car) => car.make)),
    ].map((make) => ({ value: make, label: make }));
    setMakes(uniqueMakes);
  }, []);

  useEffect(() => {
    const modelsPerMake = [
      ...new Set(
        CARS_DATA_ARRAY.filter((car) => car.make === selection.make).map(
          (car) => car.model
        )
      ),
    ].map((model) => ({ value: model, label: model }));
    if (modelsPerMake.length === 0) {
      setModels([{ value: "", label: "Select Make first" }]);
    } else {
      setModels(modelsPerMake);
    }
  }, [selection.make]);

  useEffect(() => {
    setError("");
    setNoDealers(false);
  }, [selection]);

  const handleSubmit = () => {
    if (!selection.make || !selection.model) {
      setError("Please fill out all required fields.");
      return;
    }
    setError("");
    if (!postalCodeRegex.test(selection.postalCode)) {
      setErrorPostalCode(true);
      return;
    }

    setLoading(true);

    setError("");
    setErrorPostalCode(false);

    ApiHandler.getCloseDealers(selection).then((res) => {
      if (res?.success) {
        setDealers(res.dealers);
        setShowStep(STEPS.USER_INFO);
      } else {
        setNoDealers(true);
      }
      setLoading(false);
    });
  };
  return (
    <ThemeProvider theme={APP_THEME}>
      <div className="container blue-step desktop">
        <div className="row">
          <div className="column">
            <InputLabel className="label">Make</InputLabel>
            <Select
              sx={INPUT_PLACEHOLDER}
              value={selection.make}
              onChange={(e) =>
                setSelection({ ...selection, make: e.target.value })
              }
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
              value={selection.model}
              onChange={(e) =>
                setSelection({ ...selection, model: e.target.value })
              }
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
              value={selection.postalCode}
              onChange={(e) =>
                setSelection({ ...selection, postalCode: e.target.value })
              }
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
        {noDealers && (
          <div className="row center subtitle">
            We couldn’t find any nearby dealerships for that Make and Model.
            Please update the vehicle or try another zip code.
          </div>
        )}
        <div className="row-spacer" />
        <RevoLogo />
      </div>

      <div className="container blue-step mobile">
        <div className="row row-mobile">
          <div className="column">
            <InputLabel className="label">Make</InputLabel>
            <Select
              sx={INPUT_PLACEHOLDER}
              value={selection.make}
              onChange={(e) =>
                setSelection({ ...selection, make: e.target.value })
              }
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
              value={selection.model}
              onChange={(e) =>
                setSelection({ ...selection, model: e.target.value })
              }
            >
              {models.map((model, index) => (
                <MenuItem key={index} value={model.value}>
                  {model.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="row row-mobile">
          <div>
            <InputLabel className="label">Zip Code</InputLabel>
            <TextField
              placeholder="12345"
              value={selection.postalCode}
              onChange={(e) =>
                setSelection({ ...selection, postalCode: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {errorpostalCode && (
              <FormHelperText>Invalid Zip Code</FormHelperText>
            )}
          </div>
          <div>
            {error && <div className="error">{error}</div>}
            <Button
              className="submit-button"
              variant="contained"
              color="primary"
              sx={{ fontWeight: "bold", width: 220, height: 55 }}
              onClick={handleSubmit}
            >
              {loading ? <div className="spinner"></div> : "SHOW DEALERSHIPS"}
            </Button>
          </div>
        </div>
        {noDealers && (
          <div className="row center subtitle">
            We couldn’t find any nearby dealerships for that Make and Model.
            Please update the vehicle or try another zip code.
          </div>
        )}
        <div className="row-spacer" />
        <RevoLogo />
      </div>
    </ThemeProvider>
  );
}

export default SelectMake;
