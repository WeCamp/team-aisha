import React from "react";

export default props => (
  <img
    src={props.user.avatar}
    height="20"
    width="20"
    className="avatar"
    alt={props.user.username}
  />
);
