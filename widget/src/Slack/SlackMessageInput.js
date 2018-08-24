import React from "react";
import Textarea from "./Textarea";
import Submit from "./Submit";

class SlackMessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
  }

  changeMessage(e) {
    this.setState({ message: e.target.value });
  }

  sendMessage() {
    this.props.sendMessage(this.state.message);
    this.setState({
      message: ""
    });
  }

  render() {
    return (
      <div className="input">
        <Textarea
          value={this.state.message}
          onEnter={e => this.sendMessage()}
          onChange={e => this.changeMessage(e)}
        />
        <Submit
          disabled={this.state.message.length < 1}
          onClick={e => this.sendMessage()}
        >
          Send
        </Submit>
      </div>
    );
  }
}
export default SlackMessageInput;
