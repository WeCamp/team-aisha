import React from "react";
import SlackMessageInput from "./SlackMessageInput";
import Header from "./Header";
import Message from "./Message";

export default () => (
  <div className="react-slack-client open">
    <Header />
    <div className="messages">
      <Message>Hello World!</Message>
      <Message>This is boring!</Message>
      <Message>Anyone here?</Message>
    </div>
    <SlackMessageInput />
  </div>
);
