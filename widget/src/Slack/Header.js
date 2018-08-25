import React from "react";

export default ({ onClick, open }) => (
  <div className="header-row">
    {open && (
      <div onClick={onClick}>
        <i className="fa fa-times" />
      </div>
    )}
    <h1 onClick={onClick} className="header">
      Slack client
    </h1>
  </div>
);
