import React from "react";
import SlackMessageInput from "./SlackMessageInput";
import Header from "./Header";
import Message from "./Message";
import Status from "./Status";
import Users from "./Users";

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
      open: false,
      message: "",
      incomingMessages: [],
      websocket: null,
      users: new Users(props.apiToken),
      colors: {},
      unread: 0
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
        user: {
          username: "unknown",
          avatar: "https://api.adorable.io/avatars/10/123456.png"
        },
        text: data.text,
        timestamp: data.ts
      };

      this.state.users
        .getUser(data.user)
        .then(user => {
          message.user.username = user.name;
          message.user.avatar = user.profile.image_48;
          if (this.state.open === false) {
            this.setState({
              unread: this.state.unread + 1
            });
          }
          this.addMessage(message);
        })
        .catch(error => {
          console.error("failed to retrieve user for id ", data.user, error);
          this.addMessage(message);
        });
    }
  }

  addMessage(message) {
    console.log("add message", message);
    this.setState({
      incomingMessages: [...this.state.incomingMessages, message]
    });
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
      user: {
        username: "You",
        avatar: "https://api.adorable.io/avatars/10/1234.png"
      },
      text: text,
      timestamp: timestamp
    };
    this.addMessage(message);
  }

  togglePopup() {
    this.setState({
      open: !this.state.open,
      unread: 0
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
    const { websocket, open, unread } = this.state,
      connected = websocket && websocket.readyState === 1;
    return (
      <div className="react-slack-client open">
        <Header onClick={e => this.togglePopup()} open={open} unread={unread} />
        <div className={open ? "show" : "hide"}>
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
      </div>
    );
  }
}

export default SlackClient;
