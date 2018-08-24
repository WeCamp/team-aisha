import React from "react";

export default ({ user }) => (
  <img
    src={`https://api.adorable.io/avatars/10/${user}.png`}
    height="20"
    width="20"
    className="avatar"
    alt={user}
  />
);
