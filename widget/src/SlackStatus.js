class SlackStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: props.status
        };

        console.log('triggered constructor');
    }

    /**
     * There are no events which tell you that an user stopped typing,
     * so we need to use a timeout to remove the 'typing' message.
     */
    componentDidUpdate() {
        // reset the status after 2 seconds
        setTimeout(
            function () {
                this.props.clearStatus();
            }
                .bind(this),
            5000
        );
    }

    /**
     * Show the slack-status-message
     *
     * @returns {*}
     */
    render() {
        return (<div>{this.props.status}</div>);
    }
}

export default class SlackStatus;
