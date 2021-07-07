import React from "react";

import { TaskHelper, MessagingCanvas, withTaskContext } from "@twilio/flex-ui";

class SourceChatChannelCanvas extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { task } = this.props;
    console.log(`Task SID is ${task?.sid}`)
    if (task && TaskHelper.isChatBasedTask(task) && task.attributes.sourceChatChannelSid) {
      return (
        <MessagingCanvas
          sid={task.attributes.sourceChatChannelSid}
          autoInitChannel={true} // Must do this to see the messages!
          showWelcomeMessage={false}
          inputDisabledReason='System messages only. Use "Chat" tab to engage customer'
        />
      );
    }
    return null;
  }
}

export default withTaskContext(SourceChatChannelCanvas);