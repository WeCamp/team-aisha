import React from "react";

export default ({ onClick, open, unread }) => (
  <div className="header-row">
    {open && (
      <div onClick={onClick}>
        <i className="fa fa-times" />
      </div>
    )}
    <h1 onClick={onClick} className="header">
      Slack client
    </h1>
    {!open && unread > 0 && <div className="badge badge-danger">{unread}</div>}
  </div>
);
