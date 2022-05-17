import App from "@app/app";
import { initSW } from "@app/init-sw";
import reportWebVitals from "@app/report-web-vitals";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals(console.log);

initSW();
