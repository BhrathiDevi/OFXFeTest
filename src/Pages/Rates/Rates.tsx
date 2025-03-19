import React, { useState, useEffect, useRef, useCallback } from "react";
import DropDown from "../../Components/DropDown";
import TextInput from "../../Components/TextInput";
import ProgressBar from "../../Components/ProgressBar";
import Loader from "../../Components/Loader";

import { useAnimationFrame } from "../../Hooks/useAnimationFrame";
import { ReactComponent as Transfer } from "../../Icons/Transfer.svg";

import classes from "./Rates.module.css";

import CountryData from "../../Libs/Countries.json";
import countryToCurrency from "../../Libs/CountryCurrency.json";

interface Country {
  code: string;
  name: string;
}

interface CountryCurrency {
  [key: string]: string;
}

const countries: Country[] = CountryData.CountryCodes;
const countryCurrency: CountryCurrency = countryToCurrency;

const Rates: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState<string>("AU");
  const [toCurrency, setToCurrency] = useState<string>("US");
  const [exchangeRate, setExchangeRate] = useState<number | null>(0.7456);
  const [progression, setProgression] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [trueAmount, setTrueAmount] = useState<string | null>(null);
  const [markedUpAmount, setMarkedUpAmount] = useState<string | null>(null);
  const [properError, setProperError] = useState<string | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState<{
    from: boolean;
    to: boolean;
  }>({
    from: false,
    to: false,
  });

  const fromDropdownRef = useRef<HTMLDivElement | null>(null);
  const toDropdownRef = useRef<HTMLDivElement | null>(null);

  const Flag: React.FC<{ code: string }> = ({ code }) => (
    <img
      alt={code}
      src={`/img/flags/${code}.svg`}
      width="20px"
      className={classes.flag}
    />
  );

  // Close both dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target as Node) &&
        toDropdownRef.current &&
        !toDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen({ from: false, to: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const OFX_MARKUP = 0.005; // OFX markup of 0.5%

  const calculateConversion = useCallback(() => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      setTrueAmount(null);
      setMarkedUpAmount(null);
      return;
    }

    if (exchangeRate === null) return;

    const trueResult = numericAmount * exchangeRate;
    setTrueAmount(trueResult.toFixed(2));

    const adjustedRate = exchangeRate - exchangeRate * OFX_MARKUP;
    const markedUpResult = numericAmount * adjustedRate;
    setMarkedUpAmount(markedUpResult.toFixed(2));
  }, [amount, exchangeRate, OFX_MARKUP]);

  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  const fetchLiveExchangeRate = async () => {
    try {
      const response = await fetch(
        `https://rates.staging.api.paytron.com/rate/public?sellCurrency=${countryCurrency[fromCurrency]}&buyCurrency=${countryCurrency[toCurrency]}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData && errorData.detail) {
          throw new Error(errorData.detail);
        } else {
          throw new Error(
            `Failed to fetch rates: ${response.status} ${response.statusText}`
          );
        }
      }

      const data = await response.json();
      if (data && data.retailRate) {
        setProperError(null);
        setExchangeRate(data.retailRate);
      } else {
        throw new Error("Invalid response from the server");
      }
    } catch (error) {
      setExchangeRate(null);
      setAmount("");
      setProperError((error as Error).message);
    }
  };

  const fetchData = async () => {
    if (!loading) {
      setLoading(true);
      await fetchLiveExchangeRate();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fromCurrency, toCurrency]);

  useAnimationFrame(!loading, (deltaTime: number) => {
    setProgression((prevState) => {
      if (prevState > 0.998) {
        fetchData();
        return 0;
      }
      return (prevState + deltaTime * 0.0001) % 1;
    });
  });

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.heading}>Currency Conversion</div>

        {properError && (
          <div className={classes.error}>
            <span>Error: {properError}</span>
          </div>
        )}

        <TextInput
          value={amount}
          onChange={setAmount}
          placeholder="Enter amount to convert"
        />

        {trueAmount !== null && markedUpAmount !== null && (
          <div className={classes.results}>
            <div className={classes.resultRow}>
              <span>True Amount (No Markup):</span>
              <span>
                {trueAmount} {countryCurrency[toCurrency]}
              </span>
            </div>
            <div className={classes.resultRow}>
              <span>Marked Up Amount (0.5% Markup):</span>
              <span>
                {markedUpAmount} {countryCurrency[toCurrency]}
              </span>
            </div>
          </div>
        )}

        <div className={classes.rowWrapper}>
          <div>
            <DropDown
              leftIcon={<Flag code={fromCurrency} />}
              label={"From"}
              selected={countryCurrency[fromCurrency]}
              options={countries.map(({ code }) => ({
                option: countryCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key: string) => {
                setFromCurrency(key);
              }}
              open={dropdownOpen.from}
              setOpen={() =>
                setDropdownOpen({
                  from: !dropdownOpen.from,
                  to: dropdownOpen.to,
                })
              }
              ref={fromDropdownRef}
              style={{ marginRight: "20px" }}
            />
          </div>

          <div className={classes.exchangeWrapper}>
            <div className={classes.transferIcon}>
              <Transfer height={"25px"} />
            </div>

            <div className={classes.rate}>{exchangeRate}</div>
          </div>

          <div>
            <DropDown
              leftIcon={<Flag code={toCurrency} />}
              label={"To"}
              selected={countryCurrency[toCurrency]}
              options={countries.map(({ code }) => ({
                option: countryCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key: string) => {
                setToCurrency(key);
              }}
              open={dropdownOpen.to}
              setOpen={() =>
                setDropdownOpen({
                  to: !dropdownOpen.to,
                  from: dropdownOpen.from,
                })
              }
              ref={toDropdownRef}
            />
          </div>
        </div>

        <ProgressBar
          progress={progression}
          animationClass={loading ? classes.slow : ""}
          style={{ marginTop: "20px" }}
        />

        {loading && (
          <div className={classes.loaderWrapper}>
            <Loader width={"25px"} height={"25px"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Rates;
