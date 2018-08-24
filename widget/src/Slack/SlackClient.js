import React from "react";
import SlackMessageInput from "./SlackMessageInput";
import Header from "./Header";
import Message from "./Message";
import Status from "./Status";

let availableColors = [
  "#e6194b", // Red
  "#3cb44b", // Green
  "#ffe119", // Yellow
  "#0082c8", // Blue
  "#f58231", // Orange
  "#911eb4", // Purple
  "#46f0f0", // Cyan
  "#f032e6", // Magenta
  "#d2f53c", // Lime
  "#fabebe", // Pink
  "#008080", // Teal
  "#e6beff", // Lavender
  "#aa6e28", // Brown
  "#fffac8", // Beige
  "#800000", // Maroon
  "#aaffc3", // Mint
  "#808000", // Olive
  "#ffd8b1", // Coral
  "#000080", // Navy
  "#808080", // Grey
  "#FFFFFF", // White
  "#000000" // Black
];

class SlackClient extends React.Component {
  constructor(props) {
    availableColors = availableColors.sort(() => Math.random() - 0.5);
    super(props);
    this.state = {
      message: "",
      incomingMessages: [],
      websocket: null,
      colors: {}
    };
  }

  onSlackEvent(event) {
    let data = JSON.parse(event.data);
    console.log(data);
    if (data.type === "message") {
      if (!this.state.colors[data.user]) {
        this.setState({
          colors: {
            ...this.state.colors,
            [data.user]: availableColors.pop() || "limegreen"
          }
        });
      }
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
    const { websocket } = this.state,
      connected = websocket && websocket.readyState === 1;
    return (
      <div className="react-slack-client open">
        <Header />
        <div className="messages">
          {this.state.incomingMessages.map(message => (
            <Message
              key={message.timestamp}
              user={message.user}
              timestamp={message.timestamp}
              color={this.state.colors[message.user]}
            >
              {message.text}
            </Message>
          ))}
        </div>
        <SlackMessageInput
          disabled={!connected}
          sendMessage={message => this.sendMessage(message)}
        />
        <Status connected={!!connected} typing={""} />
      </div>
    );
  }
}

export default SlackClient;
