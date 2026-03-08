import React from "react";
import styles from "./CurrentWeather.module.css";

function CurrentWeather({ data }) {
  const temperature = data.hourly.temperature_2m[0];

  return (
    <div className={styles.CurrentWeather}>
      <h3>Current Temperature</h3>
      <p>{temperature} °C</p>
    </div>
  );
}

export default CurrentWeather;
