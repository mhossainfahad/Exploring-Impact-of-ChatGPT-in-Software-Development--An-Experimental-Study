import React, { useState } from "react";
import styles from "./LocationSearch.module.css";

function LocationSearch({ onLocationSubmit }) {
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    debugger;
    e.preventDefault();
    onLocationSubmit(location);
    //onSubmit(location);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  return (
    <form className={styles.LocationSearch} onSubmit={handleSubmit}>
      <label>
        Enter location:
        <input type="text" value={location} onChange={handleLocationChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default LocationSearch;
