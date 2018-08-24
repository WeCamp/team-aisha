import React from "react";
import SlackMessageInput from "./SlackMessageInput";
import Header from "./Header";
import Message from "./Message";
import Status from "./Status";

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
    let data = JSON.parse(event.data);
    console.log(data);
    if (data.type === "message") {
      let message = {
        user: data.user,
        text: data.text,
        timestamp: data.ts
      };

      this.setState({
        incomingMessages: [...this.state.incomingMessages, message]
      });
    }
  }

  sendMessage(text) {
    if (text === "") {
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
        text: text,
        channel: this.props.channel
      })
    );

    let timestamp = new Date().getTime() / 1000;
    const message = {
      user: "You",
      text: text,
      timestamp: timestamp
    };
    this.setState({
      message: "",
      incomingMessages: [...this.state.incomingMessages, message]
    });
  }

  componentDidMount() {
    if (this.props.apiToken === undefined) {
      console.error("No api token found");
      return;
    }

    if (this.props.channel === undefined) {
      console.error("No channel found");
      return;
    }
    let initUrl =
      "https://slack.com/api/rtm.connect?token=" + this.props.apiToken;
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
        let websocket = new WebSocket(body.url);
        this.setState({ websocket: websocket });
        websocket.onopen = e => this.forceUpdate();
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
    const { websocket } = this.state;
    return (
      <div className="react-slack-client open">
        <Header />
        <div className="messages">
          {this.state.incomingMessages.map(message => (
            <Message user={message.user} timestamp={message.timestamp}>
              {message.text}
            </Message>
          ))}
        </div>
        <SlackMessageInput
          disabled={!(websocket && websocket.readyState === 1)}
          sendMessage={message => this.sendMessage(message)}
        />
        <Status
          connected={!!(websocket && websocket.readyState === 1)}
          typing={""}
        />
      </div>
    );
  }
}

export default SlackClient;
