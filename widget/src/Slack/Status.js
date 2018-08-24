import React from "react";

export default class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null
    };

    if (this.props.connected === false) {
      this.state.status = "connecting...";
    }
  }

  componentDidUpdate({ connected, typing }) {
    if (!typing && this.props.typing) {
      this.setState({ status: this.props.typing });
    } else if (connected && !this.props.connected) {
      this.setState({ status: "connecting..." });
    } else if (typing && !this.props.typing) {
      this.setState({ status: null });
    } else if (!connected && this.props.connected) {
      this.setState({ status: null });
    }
  }

  render() {
    return (
      this.state.status && <div className="status">{this.state.status}</div>
    );
  }
}
