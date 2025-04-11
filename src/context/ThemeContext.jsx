// Import React tools
import { createContext, useState, useEffect } from "react";

// Create a new context
export const ThemeContext = createContext();

// ThemeProvider will wrap your entire app
export const ThemeProvider = ({ children }) => {
  // Load theme from local storage or default to light
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // When theme changes, update HTML class and localStorage
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle function
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Share theme and toggle function to the whole app
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

