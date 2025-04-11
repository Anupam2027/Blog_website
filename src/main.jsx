import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster position="top-center" reverseOrder={false} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
