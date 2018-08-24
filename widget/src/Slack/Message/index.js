import React from "react";
import Avatar from "./Avatar";
import User from "./User";
import Body from "./Body";
import Timestamp from "./Timestamp";

export default ({ user, timestamp, children }) => (
  <div className="message own">
    <Avatar />
    <Timestamp timestamp={timestamp} />
    <User user={user} />
    <Body>{children}</Body>
  </div>
);
