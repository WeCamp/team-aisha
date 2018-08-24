import React from "react";
import Avatar from "./Avatar";
import User from "./User";
import Body from "./Body";

export default ({ children }) => (
  <div className="message own">
    <Avatar />
    <User />
    <Body>{children}</Body>
  </div>
);
