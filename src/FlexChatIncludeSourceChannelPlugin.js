import React from "react";

import { FlexPlugin } from "flex-plugin";
import { Notifications, NotificationType, Tab, TaskHelper } from "@twilio/flex-ui";
import SourceChatChannelCanvas from "./components/SourceChatChannelCanvas";

import SourceChatChannelNotification from "./components/SourceChatChannelNotification";

const PLUGIN_NAME = "FlexChatIncludeSourceChannelPlugin";
const CHAT_CHANNEL_OPEN_IN_ANOTHER_TASK = 'ChatChannelOpenInAnotherTask';

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
  
    manager.strings[CHAT_CHANNEL_OPEN_IN_ANOTHER_TASK] = (
      'There is already a task open between this customer and you. Please wrapup the existing task before accepting another'
    );

    Notifications.registerNotification({
      id: CHAT_CHANNEL_OPEN_IN_ANOTHER_TASK,
      closeButton: true,
      content: CHAT_CHANNEL_OPEN_IN_ANOTHER_TASK,
      type: NotificationType.warning,
      timeout: 10000
    });

    flex.Actions.addListener("beforeAcceptTask", (payload, abortFunction) => {
      const { task } = payload;
      // Loop through current tasks and make sure there are none open with same channel SID
      // Can happen in long-lived scenario - e.g. if agent Ends Chat, but is still wrapping when another task 
      // arrives for the same long-lived chat channel
      // WE ABSOLUTELY DO NOT WANT AGENT TO BE JOINED TO SAME CHANNEL TWICE IN FLEX - OTHERWISE WHEN ONE TASK IS
      // WRAPPED UP, THE AGENT WILL LOSE ALL MESSAGES IN THE OTHER TASK(S) FOR THE SAME CHANNEL
      if (TaskHelper.isChatBasedTask(task)) {
        const array = Array.from(manager.store.getState().flex.worker.tasks.values());
        console.log(`Existing tasks: ${array}`)
        const channelSid = TaskHelper.getTaskChatChannelSid(task);
        let result = array.find((potentialTask) => 
            channelSid === TaskHelper.getTaskChatChannelSid(potentialTask) &&
            task.sid !== potentialTask.sid && 
            TaskHelper.isTaskAccepted(potentialTask)
        );

        if (result) {
          Notifications.showNotification(CHAT_CHANNEL_OPEN_IN_ANOTHER_TASK);
          console.log("CHAT ALREADY OPEN! " + result.sid);
          abortFunction();
        } else {
          console.log("NO CHAT FOUND!");

        }
      }
    });

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
