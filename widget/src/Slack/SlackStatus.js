import React from "react";

class SlackStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: props.status,
            // oldStatus: '',
            // timeoutExpiresAt: Date.now()
        };

        // console.log('triggered constructor');
    }

    makeStatusEmpty() {
        // console.log('checking whether to empty status');
        // let currentTime = Date.now();
        // let milliSecondsLeftToClearance = (this.state.timeoutExpiresAt - currentTime);
        // let secondsLeftToClearance = milliSecondsLeftToClearance / 1000;
        // let needsToBeCleared = (secondsLeftToClearance <= 0);
        //
        // // when it's time, clear the status
        // if (needsToBeCleared === true) {
        //     console.log('yes, clear the status');
        //     this.props.clearStatus();
        //     this.setState({
        //         oldStatus: '',
        //         status: ''
        //     });
        //     return;
        // }

        /**
         * Tussentijdse hint: gebruik de builtin function clearTimeout()
         *
         * This will clear the set timeout.
         * usage:
         * this.clearStatus = setTimeout{clearStatusMessage(), 6000};
         *
         * to clear:
         * clearTimout(this.clearStatus);
         */

        //
        // // it's not time yet, so wait a bit and try again
        // setTimeout(
        //     e => {
        //         console.log('waited 3 secs, clearing status now');
        //         this.makeStatusEmpty()
        //     },
        //     3000
        // );
    }

    /**
     * There are no events which tell you that an user stopped typing,
     * so we need to use a timeout to remove the 'typing' message.
     */
    componentDidUpdate(previousProps, previousState) {
        // let statusUpdated = (this.props.status !== previousState.status);
        // console.log('----------------');
        // console.log(this.props);
        // console.log(previousState);
        // console.log(statusUpdated);
        //
        // if (statusUpdated) {
        //     console.log('status updated!');
        //
        //     this.makeStatusEmpty();
        // }
        // else{
        //     console.log('no update');
        // }
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

export default SlackStatus;
