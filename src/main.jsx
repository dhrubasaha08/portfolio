import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import "./artwork.css";
import "./variant.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Portfolio root element was not found.");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
