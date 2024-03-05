import React, { useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, ThemeProvider } from "@mui/material";
import CurrencyTextField from "@lupus-ai/mui-currency-textfield";

import { APP_THEME, INPUT_PLACEHOLDER } from "App";
import { CARS_DATA_ARRAY } from "data/2024 EV Data - EV Data";
import RevoLogo from "components/RevoLogo";

function LeftMenu({ setSelection, selection, lease, setLease }) {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const uniqueMakes = [
      ...new Set(CARS_DATA_ARRAY.map((car) => car.make)),
    ].map((make) => ({ value: make, label: make }));
    setMakes(uniqueMakes);

    if (!selection.make) {
      setSelection({ make: "Hyundai", model: "Ioniq 5" });
    }
  }, []);

  useEffect(() => {
    const modelsPerMake = [
      ...new Set(
        CARS_DATA_ARRAY.filter((car) => car.make === selection.make).map(
          (car) => car.model
        )
      ),
    ].map((model) => ({ value: model, label: model }));
    setModels(modelsPerMake);
  }, [selection.make]);

  useEffect(() => {
    const selectedPrice =
      CARS_DATA_ARRAY.find(
        (car) => car.make === selection.make && car.model === selection.model
      )
        ?.price.replace("$", "")
        .replace(",", "") || 0;
    setLease({ ...lease, price: Number(selectedPrice) });
  }, [selection.model]);

  return (
    <ThemeProvider theme={APP_THEME}>
      <div className="left_menu blue-step">
        <div className="column">
          <div className="title">Lease details</div>
        </div>
        <div className="row-spacer" />
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
        <div className="row-spacer" />
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
        <div className="row-spacer" />
        <div className="column">
          <InputLabel className="label">Purchase Price</InputLabel>
          <CurrencyTextField
            variant="outlined"
            decimalPlaces={0}
            value={lease.price}
            onChange={(e) => setLease({ ...lease, price: e.target.value })}
          />
        </div>
        <div className="row-spacer" />
        <div className="row-mobile">
          <div className="column">
            <InputLabel className="label">Down Payment</InputLabel>
            <CurrencyTextField
              variant="outlined"
              decimalPlaces={0}
              value={lease.downPayment}
              onChange={(e) =>
                setLease({ ...lease, downPayment: e.target.value })
              }
            />
          </div>
          <div className="row-spacer" />
          <div className="column">
            <InputLabel className="label">Trade In Value</InputLabel>
            <CurrencyTextField
              variant="outlined"
              decimalPlaces={0}
              value={lease.tradeInValue}
              onChange={(e) =>
                setLease({ ...lease, tradeInValue: e.target.value })
              }
            />
          </div>
        </div>
        <div className="row-spacer" />
        <RevoLogo />
      </div>
    </ThemeProvider>
  );
}

export default LeftMenu;
