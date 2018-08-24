import SlackStatus from './SlackStatus';

class SlackClient extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            websocket: null,
            slackStatus: ''
        }
    }

    onSlackEvent(event) {
        let eventData = JSON.parse(event.data);
        console.log('a slack event happened!', eventData);

        if( eventData.type == 'user_typing'){
            this.setState({slackStatus: "User " + eventData.user + " is typing a message"});
        }
    }

    clearStatus()
    {
        this.setState({slackStatus: ''});
    }

    sendMessage() {
        if (this.state.message === '') {
            console.error('empty message');
            return;
        }

        if (this.state.websocket === null) {
            console.error('no open websocket');
            return;
        }

        this.state.websocket.send(JSON.stringify({
                "type": "message",
                "text": this.state.message,
                "channel": "CCBPV1E9F"
            }
        ));

        // clean the input box again
        this.setState({message: 'sent!'});

        // reset the value after half a second
        setTimeout(
            function () {
                this.setState({message: ''});
            }
                .bind(this),
            500
        );
    }

    detectEnter(event) {
        if(event.keyCode == 13 || event.which == 13){
            // only sent on non-empty
            this.sendMessage();
        }
    }

    changeMessage(event) {
        this.setState({
            message: event.target.value
        });
    }

    componentDidMount() {
        console.log('mounted')
        e => {e.setState({slackStatus: 'Connection to slack...'})};
        let initUrl = "https://slack.com/api/rtm.connect?token=xoxb-3547151076-420352797363-jQbOTPcBCWuR2jaeaSKpQ883";
        fetch(initUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            credentials: "same-origin"
        }).then(function (response) {
            e => {e.setState({slackStatus: 'Success!'})};
            return response.json();
        }).then(body => {
            let websocket = new WebSocket(body.url);
            this.setState({websocket: websocket});
            websocket.onmessage = e => this.onSlackEvent(e)
        }).catch(console.error)
    }

    componentWillUnmount() {
        if (this.state.websocket !== null) {
            console.log('close connection');
            this.setState({slackStatus: 'closing connection'});
            this.state.websocket.close()
        }
    }

    render() {
        return (
            <div>
                <textarea onKeyPress={e => this.detectEnter(e)} value={this.state.message}
                          onChange={e => this.changeMessage(e)}></textarea>
                <button onClick={e => this.sendMessage()}>Post</button>
                <SlackStatus status={this.state.slackStatus} clearStatus={e => this.clearStatus()}/>
            </div>
        );
    }
}

class Component extends React.Component {
    render() {
        return (
            <div className="react-slack-chat">
                <SlackClient/>
            </div>
        );
    }
}

ReactDOM.render(<Component/>, document.getElementById("reactor-container"));
