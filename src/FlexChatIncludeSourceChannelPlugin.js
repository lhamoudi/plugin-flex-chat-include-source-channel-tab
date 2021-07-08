import React from "react";

import { FlexPlugin } from "flex-plugin";
import { Tab, TaskHelper } from "@twilio/flex-ui";
import SourceChatChannelCanvas from "./components/SourceChatChannelCanvas";

import SourceChatChannelNotification from "./components/SourceChatChannelNotification";

const PLUGIN_NAME = "FlexChatIncludeSourceChannelPlugin";

export default class FlexChatIncludeSourceChannelPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {


    flex.TaskCanvas.Content.add(
      <SourceChatChannelNotification 
        key="sourceChatChannelNotification" />, 
        { 
          sortOrder: -1,
          if: (props) => TaskHelper.isChatBasedTask(props.task) && props.task.attributes.sourceChatChannelSid
        });
 
    // Add the History tab
    flex.TaskCanvasTabs.Content.add(
      <Tab  
        key="source-chat"
        uniqueName="source-chat"
        label="History" 
        hidden={false}> 
          <SourceChatChannelCanvas />
      </Tab>, 
      {
        sortOrder: 3,
        if: (props) => TaskHelper.isChatBasedTask(props.task) && props.task.attributes.sourceChatChannelSid
      }
    );

    // Remove the Info tab
    //flex.TaskCanvasTabs.Content.remove("info");


  }



}
