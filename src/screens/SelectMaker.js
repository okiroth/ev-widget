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

function SelectMaker({ setShowStep, setSelection }) {
  const [maker, setMaker] = useState("");
  const [model, setModel] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [errorZipcode, setErrorZipcode] = useState(false);

  const [makers, setMakers] = useState([]);
  const [models, setModels] = useState([]);

  const [cars, setCars] = useState([]);

  const zipCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;


  // The CSV is the direct download from
  // https://docs.google.com/spreadsheets/d/1Xifx_6hkbYCXAYAR0IWlZEn40fi56a9k8q8_stU6pr4/edit#gid=0
  ///
  ///
  // !!!!! REMOVE THE FIRST LINE of the CSV !!!!!
  ///
  ///
  useEffect(() => {
    fetch("/data/cars.csv")
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split("\n");
        lines.forEach((line) => {
          const [maker, model] = line.split(",");
          setCars((prev) => [...prev, { maker, model }]);
        });
      });
  }, []);

  // This checks for unique makers
  useEffect(() => {
    const uniqueMakers = [...new Set(cars.map((car) => car.maker))].map(
      (maker) => ({ value: maker, label: maker })
    );
    setMakers(uniqueMakers);
  }, [cars]);
  
  // This checks for unique models after the maker is selected
  useEffect(() => {
    const uniqueModels = [
      ...new Set(
        cars.filter((car) => car.maker === maker).map((car) => car.model)
      ),
    ].map((model) => ({ value: model, label: model }));
    setModels(uniqueModels);
  }, [cars, maker]);

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
            <Select
              sx={INPUT_PLACEHOLDER}
              value={maker}
              onChange={(e) => setMaker(e.target.value)}
            >
              {makers.map((maker, index) => (
                <MenuItem key={index} value={maker.value}>
                  {maker.label}
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
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter") && handleSubmit()}
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
