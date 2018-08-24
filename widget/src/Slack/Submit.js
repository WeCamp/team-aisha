import React from "react";

export default ({ children }) => (
  <button className="submit disabled" disabled>
    {children}
  </button>
);
