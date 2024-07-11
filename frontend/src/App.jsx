import React, { useState } from "react";
import InputField from "./components/InputField";
import DarkModeToggle from "./components/DarkModeToggle";
import "./styles.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>
      <DarkModeToggle darkMode={darkMode} onToggle={handleToggleDarkMode} />
      <InputField />
    </div>
  );
}

export default App;
