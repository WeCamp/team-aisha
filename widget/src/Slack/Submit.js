import React from "react";

export default ({ children, disabled, onClick }) => (
  <button
    className={`submit ${disabled ? "disabled" : ""}`}
    disabled={disabled}
    onClick={e => !disabled && onClick()}
  >
    {children}
  </button>
);
