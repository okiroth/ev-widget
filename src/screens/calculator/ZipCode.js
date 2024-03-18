import React, { useState, useEffect } from "react";
import {
  Button,
  InputLabel,
  TextField,
  FormHelperText,
  ThemeProvider,
} from "@mui/material";
import { APP_THEME, STEPS } from "App";
import { ApiHandler } from "ApiHandler";

function ZipCode({
  setShowStep,
  setSelection,
  selection,
  setDealers,
  setUserInfo,
  userInfo,
}) {
  const [errorpostalCode, setErrorPostalCode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [noDealers, setNoDealers] = useState(false);

  const [imgSrc, setImageSrc] = useState("/car.png");

  const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

  useEffect(() => {
    if (selection.model) {
      setImageSrc(ApiHandler.getCarImage(selection.make, selection.model));
    }
  }, [selection.model]);

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

    ApiHandler.getCloseDealers(selection).then((data) => {
      setLoading(false);
      if (data && data.length > 0) {
        setDealers(data);
        setUserInfo((prev) => ({ ...prev, selected: data.map((d) => d.uuid) }));
        setShowStep(STEPS.USER_INFO);
      } else {
        setNoDealers(true);
      }
    });
  };
  return (
    <ThemeProvider theme={APP_THEME}>
      <div className="container">
        <div>
          <div className="title">Calculated your lease? Now find your car!</div>
          <div className="row-spacer" />
          <div className="subtitle">
            Tell us a little bit about yourself to receive offers from dealers
            near you
          </div>
        </div>
        <div className="row-spacer" />
        <div className="row">
          <div className="column">
            <InputLabel className="label">Zip Code</InputLabel>
            <TextField
              id="user-car-make"
              placeholder="12345"
              value={selection.postalCode}
              onChange={(e) => {
                setError("");
                setErrorPostalCode(false);
                setSelection({ ...selection, postalCode: e.target.value });
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {errorpostalCode && (
              <FormHelperText>Invalid Zip Code</FormHelperText>
            )}
            <div className="row-spacer" />
            <div className="row-spacer" />
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
                  "DEALERSHIPS NEARBY"
                )}
              </Button>
            </div>
          </div>
          <div className="car_image_calc desktop">
            <img onError={() => setImageSrc("/car.png")} src={imgSrc} alt="" />
          </div>
        </div>
        <div className="row-spacer" />
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

export default ZipCode;
