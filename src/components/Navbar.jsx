import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { ADMIN_EMAIL } from "../firebase/config";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-white dark:bg-gray-900">
      {/* Logo / Brand */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">DevLog</h1>

      {/* Right Side Navigation Links */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-700 dark:text-white">Home</Link>

        {user ? (
          <>
            <Link to="/write" className="text-gray-700 dark:text-white">Write</Link>
            <Link to="/profile" className="text-gray-700 dark:text-white">Profile</Link>

            {/* Admin-only Dashboard link */}
            {user.email === ADMIN_EMAIL && (
              <Link to="/admin" className="text-gray-700 dark:text-white">Dashboard</Link>
            )}

            <button
              onClick={logout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            <Link to="/signup" className="text-green-500 hover:underline">Signup</Link>
          </>
        )}

        {/* ✅ Resume Download Button */}
        <a
          href="/Anupam_Resume.pdf"
          download
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
        >
          Resume
        </a>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
