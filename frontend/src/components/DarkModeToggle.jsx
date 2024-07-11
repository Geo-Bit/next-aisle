import React from "react";

function DarkModeToggle({ darkMode, onToggle }) {
  return (
    <div className="dark-mode-toggle">
      <label className="switch">
        <input type="checkbox" checked={darkMode} onChange={onToggle} />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default DarkModeToggle;
