import React, { useEffect, useState } from "react";

const TopSectionCalc = ({ lease }) => {
  const [withTaxCredit, setWithTaxCredit] = useState(0);
  const [withoutTaxCredit, setWithoutTaxCredit] = useState(0);

  const TERM_IN_MONTHS = 36;
  const RESIDUAL_VALUE_PERCENT = 0.62;
  const MONEY_FACTOR = 0.003733;
  const DEALER_FEES = 750;
  const FEDERAL_TAX_CREDIT = 7500;
  const SALES_TAX_RATE = 0.0625; // Replace with the actual sales tax rate

  const getMonthlyPayment = (purchasePrice, taxCredit) => {
    const grossCapCost =
      purchasePrice + DEALER_FEES - (taxCredit ? FEDERAL_TAX_CREDIT : 0);
    const netCapCost = grossCapCost - lease.downPayment - lease.tradeInValue;
    const residualValue = purchasePrice * RESIDUAL_VALUE_PERCENT;
    const depreciation = netCapCost - residualValue;
    const rentCharge =
      (netCapCost + residualValue) * MONEY_FACTOR * TERM_IN_MONTHS;
    const salesTax = (depreciation + rentCharge) * SALES_TAX_RATE;
    const salesTaxOnLease = salesTax / TERM_IN_MONTHS;
    const calcLeasePayment = (depreciation + rentCharge) / TERM_IN_MONTHS;
    const totalLeasePayment = salesTaxOnLease + calcLeasePayment;

    return totalLeasePayment;
  };

  useEffect(() => {
    if (lease.price) {
      setWithoutTaxCredit(getMonthlyPayment(lease.price));
      setWithTaxCredit(getMonthlyPayment(lease.price, true));
    }
  }, [lease]);

  return (
    <div className="top_section_calc">
      <div>
        <div className="title">Estimated monthly lease payment</div>
        <div className="row-spacer" />
        <div className="row">
          <div className="column">
            <div className="big_number text-blue">
              ${withTaxCredit.toFixed(0)}
            </div>
            <div>With federal tax credit</div>
          </div>
          <div className="column">
            <div className="big_number text-gray">
              ${withoutTaxCredit.toFixed(0)}*
            </div>
            <div>*Without federal tax credit</div>
          </div>
        </div>
        <div className="row-spacer" />
        <div className="row-spacer" />
        <div className="text-gray">
          <span>
            Federal tax credit based on eligibility. To learn more about
            requirements,{" "}
            <a
              className="text-gray"
              target="_blank"
              href="https://www.nerdwallet.com/article/taxes/ev-tax-credit-electric-vehicle-tax-credit"
              rel="noreferrer"
            >
              click here
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopSectionCalc;
