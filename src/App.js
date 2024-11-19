import React, { useState, useEffect, useMemo } from "react";
import { faker } from "@faker-js/faker";
import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";

import "./App.scss";

const App = () => {
  const [country, setCountry] = useState("US");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [showTable, setShowTable] = useState(false);

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
    setData([]);
    setShowTable(false);
    setError("");
    setCount(0);
  }, [country]);

  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
  };

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
        <label htmlFor="country" className="label">Select Country:</label>
        <select id="country" value={country} onChange={(e) => handleCountryChange(e.target.value)} className="select">
          {countries.map(({ code, name, flag }) => (
            <option key={code} value={code}>
              {flag} {name} ({code})
            </option>
          ))}
        </select>
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