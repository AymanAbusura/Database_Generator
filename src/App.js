/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { faker } from "@faker-js/faker";
import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";
import "./App.scss";
import 'font-awesome/css/font-awesome.min.css';

const App = () => {
  const [country, setCountry] = useState("US");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filterKey, setFilterKey] = useState("");

  const getFlagEmoji = (countryCode) =>
    countryCode
      .toUpperCase()
      .split("")
      .map((char) => String.fromCodePoint(127397 + char.charCodeAt()))
      .join("");

  const countries = useMemo(() => {
    return getCountries().map((countryCode) => ({
      code: countryCode,
      name: new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode),
      flag: getFlagEmoji(countryCode),
    }));
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) {
      setFilteredCountries(countries);
    }
  }, [country, isDropdownOpen]);

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    const typedKey = e.key.toLowerCase();

    if (!isDropdownOpen) return;

    if (typedKey >= "a" && typedKey <= "z") {
      setFilterKey(typedKey);
      setFilteredCountries(
        countries.filter((country) =>
          country.name.toLowerCase().startsWith(typedKey)
        )
      );
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    } else if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp") {
    } else if (typedKey === "") {
      setFilterKey("");
      setFilteredCountries(countries);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [countries, isDropdownOpen]);

  const generatePhoneNumber = (countryCode) => {
    const callingCode = getCountryCallingCode(countryCode);
    if (!callingCode) {
      setError(`Unable to fetch calling code for country: ${countryCode}`);
      return null;
    }

    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      const rawPhone = faker.phone.number("##########");
      const fullPhone = `+${callingCode}${rawPhone}`;
      const phoneNumber = parsePhoneNumberFromString(fullPhone);

      if (phoneNumber && isValidPhoneNumber(fullPhone) && !phoneNumber.ext) {
        return phoneNumber.formatInternational();
      }
    }

    return `+${callingCode}123456789`;
  };

  const generateDatabase = () => {
    if (count < 1 || count > 1000) {
      setError("Please enter a number between 1 and 1000.");
      return;
    }

    setError("");
    const generatedData = Array.from({ length: count }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email(firstName, lastName);
      const phone = generatePhoneNumber(country);
      return { first_name: firstName, last_name: lastName, email, phone };
    });

    setData(generatedData);
    setShowTable(true);
  };

  const clearData = () => {
    setData([]);
    setShowTable(false);
    setCountry("US");
    setCount(0);
  };

  const downloadJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "generated_data.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <h1 className="title">🌍 Global Database Generator</h1>

      <div className="input-group">
        <label className="label">Select Country:</label>
        <div
          className="custom-dropdown"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="selected-country">
            {countries.find(({ code }) => code === country)?.flag}{" "}
            {countries.find(({ code }) => code === country)?.name} ({country})
            <span className="dropdown-arrow">
              {isDropdownOpen ? (
                <i className="fa fa-chevron-up"></i>
              ) : (
                <i className="fa fa-chevron-down"></i>
              )}
            </span>
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {filteredCountries.map(({ code, name, flag }) => (
                <div
                  key={code}
                  className="dropdown-item"
                  onClick={() => handleCountryChange(code)}
                >
                  {flag} {name} ({code})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="count" className="label">Number of Records (1-1000):</label>
        <input
          id="count"
          type="number"
          min="1"
          max="1000"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="input"
        />
      </div>
      {error && <p className="error">{error}</p>}

      <div className="button-container">
        <button onClick={generateDatabase} className="button">Generate</button>
        <button onClick={clearData} className="clear-button">Clear</button>
      </div>

      {showTable && (
        <div className="table-container">
          <button onClick={downloadJSON} className="download-button">Download JSON</button>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.first_name}</td>
                  <td>{entry.last_name}</td>
                  <td>{entry.email}</td>
                  <td>{entry.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;