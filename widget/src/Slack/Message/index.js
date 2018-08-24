import React from "react";
import Avatar from "./Avatar";
import User from "./User";
import Body from "./Body";
import Timestamp from "./Timestamp";

const contraColorMap = {
  "#e6194b": "black", // Red
  "#3cb44b": "white", // Green
  "#ffe119": "black", // Yellow
  "#0082c8": "white", // Blue
  "#f58231": "white", // Orange
  "#911eb4": "white", // Purple
  "#46f0f0": "black", // Cyan
  "#f032e6": "white", // Magenta
  "#d2f53c": "black", // Lime
  "#fabebe": "black", // Pink
  "#008080": "white", // Teal
  "#e6beff": "black", // Lavender
  "#aa6e28": "white", // Brown
  "#fffac8": "black", // Beige
  "#800000": "white", // Maroon
  "#aaffc3": "black", // Mint
  "#808000": "white", // Olive
  "#ffd8b1": "black", // Coral
  "#000080": "white", // Navy
  "#808080": "white", // Grey
  "#FFFFFF": "black", // White
  "#000000": "white" // Black
};

export default ({ user, timestamp, children, color }) => (
  <div
    className={`message ${user !== "You" ? "other" : "own"}`}
    style={color && { backgroundColor: color, color: contraColorMap[color] }}
  >
    <Avatar user={user} />
    <Timestamp timestamp={timestamp} />
    <User user={user} />
    <Body>{children}</Body>
  </div>
);
