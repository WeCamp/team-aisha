import React from "react";
import SlackMessageInput from "./SlackMessageInput";
import Header from "./Header";
import Message from "./Message";

class SlackClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      incomingMessages: [],
      websocket: null
    };
  }

  onSlackEvent(event) {
    console.log(this);
    var data = JSON.parse(event.data);
    console.log(data.type);
    if (data.type === "message") {
      var message = "[" + data.ts + "] " + data.text;
      console.log(message);
      this.setState({
        incomingMessages: [...this.state.incomingMessages, message]
      });
    }
  }

  sendMessage(message) {
    if (message === "") {
      console.error("empty message");
      return;
    }

    if (this.state.websocket === null) {
      console.error("no open websocket");
      return;
    }

    this.state.websocket.send(
      JSON.stringify({
        type: "message",
        text: message,
        channel: "CCBPV1E9F"
      })
    );

    this.setState({
      message: ""
    });
  }

  changeMessage(event) {
    this.setState({
      message: event.target.value
    });
  }

  componentDidMount() {
    console.log("mounted");
    var initUrl =
      "https://slack.com/api/rtm.connect?token=xoxb-3547151076-420352797363-jQbOTPcBCWuR2jaeaSKpQ883";
    fetch(initUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin"
    })
      .then(function(response) {
        return response.json();
      })
      .then(body => {
        var websocket = new WebSocket(body.url);
        this.setState({ websocket: websocket });
        websocket.onmessage = e => this.onSlackEvent(e);
      })
      .catch(console.error);
  }

  componentWillUnmount() {
    if (this.state.websocket !== null) {
      console.log("close connection");
      this.state.websocket.close();
    }
  }

  render() {
    return (
      <div className="react-slack-client open">
        <Header />
        <div className="messages">
          {this.state.incomingMessages.map(message => (
            <Message>{message}</Message>
          ))}
        </div>
        <SlackMessageInput sendMessage={message => this.sendMessage(message)} />
      </div>
    );
  }
}

export default SlackClient;
