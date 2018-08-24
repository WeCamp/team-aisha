import React from "react";

const filterKeyCode = (e, callback, ...params) => {
  if (e.key === "Enter" && e.shiftKey !== true) {
    e.preventDefault();
    callback(...params);
  }
};

export default ({ value, onChange, onEnter, disabled }) => (
  <textarea
    disabled={disabled}
    className="message-input"
    value={value}
    onChange={onChange}
    onKeyPress={e => filterKeyCode(e, onEnter)}
    placeholder="Type a message..."
  />
);
