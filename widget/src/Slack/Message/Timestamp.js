import React from "react";
import dateformat from "dateformat";

const formatTimestamp = timestamp => {
  const format = "h:MM:ss TT";
  return dateformat(Math.floor(timestamp * 1000), format);
};

export default props => (
  <div className="message-timestamp">{formatTimestamp(props.timestamp)}</div>
);
