class SlackClient extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      websocket: null
    }
  }

  onSlackEvent(event) {
    console.log('a slack event happened!', JSON.parse(event.data));
  }

  sendMessage() {
    if (this.state.message === '') {
      console.error('empty message');
      return;
    }

    if (this.state.websocket === null) {
      console.error('no open websocket')
      return
    }

    this.state.websocket.send(JSON.stringify({
      "type":"message",
      "text":this.state.message,
      "channel":"CCBPV1E9F"}
    ));
  }

  changeMessage(event) {
    this.setState({
      message: event.target.value
    });
  }

  componentDidMount() {
    console.log('mounted')
    var initUrl = "https://slack.com/api/rtm.connect?token=xoxb-3547151076-420352797363-jQbOTPcBCWuR2jaeaSKpQ883";
    fetch(initUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: "same-origin"
    }).then(function(response) {
      return response.json();
    }).then(body => {
      var websocket = new WebSocket(body.url)
      this.setState({websocket: websocket})
      websocket.onmessage = this.onSlackEvent
    }).catch(console.error)
  }

  componentWillUnmount() {
    if (this.state.websocket !== null) {
      console.log('close connection')
      this.state.websocket.close()
    }
  }

  render() {
    return (
      <div>
      <textarea onChange={e => this.changeMessage(e)}></textarea>
      <button onClick={e => this.sendMessage()}>Post</button>
      </div>
    );
  }
}


class Component extends React.Component {
  render() {
    return (
      <div className="react-slack-chat">
        <SlackClient />
      </div>
    );
  }
}

ReactDOM.render(<Component />, document.getElementById("reactor-container"));
