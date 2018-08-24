import React from "react";
import Avatar from "./Avatar";
import User from "./User";
import Body from "./Body";
import Timestamp from "./Timestamp";

export default ({ timestamp, children }) => (
  <div className="message own">
    <Avatar />
    <User />
    <Timestamp timestamp={timestamp} />
    <Body>{children}</Body>
  </div>
);
