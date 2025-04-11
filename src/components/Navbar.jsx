import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { ADMIN_EMAIL } from "../firebase/config";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
          doBlogging
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/" className="hover:text-blue-500 text-gray-700 dark:text-white">Home</Link>
          {user && (
            <>
              <Link to="/write" className="hover:text-blue-500 text-gray-700 dark:text-white">Write</Link>
              <Link to="/profile" className="hover:text-blue-500 text-gray-700 dark:text-white">Profile</Link>
              {user.email === ADMIN_EMAIL && (
                <>
                  <Link to="/admin" className="text-yellow-500 font-medium">Dashboard</Link>
                  <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">👑 Admin</span>
                </>
              )}
              <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
              <Link to="/signup" className="text-green-500 hover:underline">Signup</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button onClick={toggleMenu} className="md:hidden text-gray-700 dark:text-white focus:outline-none">
        {menuOpen ? (
  <XMarkIcon className="h-6 w-6" />
) : (
  <Bars3Icon className="h-6 w-6" />
)}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
  {menuOpen && (
    <motion.div
      key="mobile-menu"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 space-y-3 overflow-hidden"
    >
      <Link to="/" onClick={toggleMenu} className="block text-gray-700 dark:text-white">Home</Link>
      {user && (
        <>
          <Link to="/write" onClick={toggleMenu} className="block text-gray-700 dark:text-white">Write</Link>
          <Link to="/profile" onClick={toggleMenu} className="block text-gray-700 dark:text-white">Profile</Link>
          {user.email === ADMIN_EMAIL && (
            <>
              <Link to="/admin" onClick={toggleMenu} className="block text-yellow-500">Dashboard</Link>
              <span className="text-xs text-yellow-700">👑 Admin</span>
            </>
          )}
          <button onClick={handleLogout} className="text-red-500 block">Logout</button>
        </>
      )}
      {!user && (
        <>
          <Link to="/login" onClick={toggleMenu} className="block text-blue-500">Login</Link>
          <Link to="/signup" onClick={toggleMenu} className="block text-green-500">Signup</Link>
        </>
      )}
    </motion.div>
  )}
</AnimatePresence>

    </nav>
  );
};

export default Navbar;
