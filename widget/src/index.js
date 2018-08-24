class SlackClient extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      incomingMessages: [''],
      websocket: null
    }
  }

  onSlackEvent(event) {
    console.log(this)
    var data = JSON.parse(event.data);
    console.log(data.type)
    if (data.type === 'message') {
      var message = "[" + data.ts + "] " + data.text;
      console.log(message)
      this.setState({
        incomingMessages: [... this.state.incomingMessages, message]
      })
    }

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

    this.setState({
      message: ''
    })
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
      websocket.onmessage = (e => this.onSlackEvent(e))
    }).catch(console.error)
  }

  componentWillUnmount() {
    if (this.state.websocket !== null) {
      console.log('close connection')
      this.state.websocket.close()
    }
  }

  render() {
    console.log('state', this.state)
    return (
      <div>
        <div>
          <textarea style={{height: 300, width: 200}} value={this.state.incomingMessages.join("\n")}></textarea>
        </div>
        <div>
          <textarea style={{height: 200, width: 200}} onChange={e => this.changeMessage(e)} value={this.state.message}></textarea>
          <button onClick={e => this.sendMessage()}>Post</button>
        </div>
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
