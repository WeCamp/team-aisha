import "babel-polyfill";

import { ReactSlackChat } from "react-slack-chat";

class Component extends React.Component {
  render() {
    return (
      <div className="react-slack-chat">
        <ReactSlackChat
          botName="reactor-the-bot"
          apiToken={btoa(
            "xoxb-3547151076-420352797363-jQbOTPcBCWuR2jaeaSKpQ883"
          )}
          channels={[{ id: "T03G34F28", name: "reactor" }]}
          userImage="http://www.iconshock.com/img_vista/FLAT/mail/jpg/robot_icon.jpg"
          debugMode
        />
      </div>
    );
  }
}

ReactDOM.render(<Component />, document.getElementById("reactor-container"));
