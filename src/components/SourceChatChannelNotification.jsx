import React from 'react';

import { Actions } from '@twilio/flex-ui';
import { SourceChatChannelNotificationStyles } from './SourceChatChannelNotification.Styles';

class SourceChatChannelNotification extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: true }
  }

  render() {  
    if (this.state.isOpen) {
      return (
        <SourceChatChannelNotificationStyles>
          Automated system history exists.&nbsp;
          <i className="accented" onClick={() => this.openHistoryTab()}>Click here</i> to view.
          <i className="accented right" onClick={() => this.closeNotification()}>
            close
          </i>
        </SourceChatChannelNotificationStyles>
      );
    }
    return null;
  }

  openHistoryTab() {
    Actions.invokeAction("SetComponentState", { 
      name: "AgentTaskCanvasTabs", 
      state: { selectedTabName: "source-chat" } 
    });
    this.closeNotification();  
  }

  closeNotification() {
    this.setState({ isOpen: false });        
  }
}


export default SourceChatChannelNotification;
