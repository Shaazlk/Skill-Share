// src/components/ui/DarkModeToggle.js
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button 
      onClick={toggleDarkMode} 
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
        darkMode 
          ? "bg-gray-700 text-gray-200 hover:bg-gray-600" 
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
      <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
};

export default DarkModeToggle;