import React from "react";
import SlackMessageInput from "./SlackMessageInput";
import Header from "./Header";
import Message from "./Message";
import SlackStatus from "./SlackStatus";
import Users from "./Users";
import WebApi from "./Client/WebApi";

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
    this.webApi = new WebApi(props.apiToken);
    this.users = new Users(this.webApi)
    this.state = {
      open: false,
      message: "",
      slackStatus: "",
      incomingMessages: [],
      websocket: null,
      colors: {},
      connectionTimeout: 5000,
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

      this.users
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
    if (data.type === "user_typing") {
      this.users.getUser(data.user).then(user =>
        this.setState({
          slackStatus: `User ${user.name} is typing`
        })
      );

      // clear the timer that is already set
      console.log("clearing existing timer");
      clearTimeout(this.statusClearer);

      console.log("setting new timer");
      // it's not time yet, so wait a bit and try again
      this.statusClearer = setTimeout(e => {
        // console.log('it should clear the status now');
        this.slackStatusClear();
      }, 6000);
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

  connectToSlack() {
    this.setState({ slackStatus: "Connection to slack..." });
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
      .then(response => {
        if (response.ok === false) {
          if (response.status === 429) {
            this.setState({ slackStatus: "Rate limited! Stop sending!" });
          } else {
            this.setState({ slackStatus: "Error during connecting to Slack" });
          }

          // console.log('Will try again in ' + (this.state.connectionTimeout / 1000) + ' seconds');
          //
          // // try again in n secs
          // setTimeout(
          //     e => {
          //         console.log('reconnecing after failed attempt');
          //         // this.connectToSlack()
          //     },
          //     this.connectionTimeout
          // );
          //
          // // increase the connectionTimout for the next run
          // let increasedTimeout = this.state.connectionTimeout * 2;
          // this.setState({connectionTimeout: increasedTimeout});
        } else {
          this.setState({ slackStatus: "Successfully connected" });
        }
        return response.json();
      })
      .then(body => {
        if (body.ok === false) {
          this.setState({
            slackStatus: "Connection failed! Message: " + body.error
          });
          console.error("Connection to Slack failed! Message: " + body.error);
        }

        let websocket = new WebSocket(body.url);
        this.setState({ websocket: websocket });
        websocket.onopen = e => this.forceUpdate();
        websocket.onmessage = e => this.onSlackEvent(e);
      })
      .catch(console.error);
  }

  componentDidMount() {
    this.connectToSlack();
  }

  componentWillUnmount() {
    if (this.state.websocket !== null) {
      this.setStatus({ slackStatus: "closing connection" });
      console.log("close connection");
      this.state.websocket.close();
    }
  }

  slackStatusClear() {
    console.log("resetting");
    this.setState({ slackStatus: "" });
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
          <SlackStatus
            status={this.state.slackStatus}
            clearStatus={e => this.slackStatusClear()}
          />
        </div>
      </div>
    );
  }
}

export default SlackClient;
