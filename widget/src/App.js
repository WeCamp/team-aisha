import React, { Component } from "react";
import SlackClient from "./Slack/SlackClient";

class App extends Component {
  render() {
    return <SlackClient apiToken={"xoxb-3547151076-420352797363-jQbOTPcBCWuR2jaeaSKpQ883"} channel={"CCBPV1E9F"}/>;
  }
}

export default App;
