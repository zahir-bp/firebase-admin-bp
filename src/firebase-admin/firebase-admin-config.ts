import * as admin from "firebase-admin";
import {
  MessagingPayload,
  TokenMessage,
} from "firebase-admin/lib/messaging/messaging-api";

require("dotenv").config();

const client_email = process.env.client_email;
const project_id = process.env.project_id;
const private_key = process.env.private_key;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: project_id,
    privateKey: private_key.replace(/\\n/g, "\n"),
    clientEmail: client_email,
  }),
});

/**
 * To use this function, will need to save driver's FCM token to database.
 * Will need to generate the value during login flow.
 *
 * Card trx happens, then BE will need to check the card is assigned to which driver. Then take
 * the driver's FCM token (saved during driver's first time login) and send the message.
 *
 * @param token
 * @param title
 * @param message
 * @returns boolean to indicate success or fail
 */
export const sendMessageToken = async (
  token: string,
  title: string,
  message?: string
) => {
  const sendTokenPayload: TokenMessage = {
    token: token,
    notification: {
      title: title,
      body: message,
    },
    android: {
      priority: "high",
    },
  };

  try {
    admin
      .messaging()
      .send(sendTokenPayload)
      .then((response) => {
        if (response) {
          return true;
        }
      });
  } catch (error) {
    console.log("ERROR: ", error);
  }

  return false;
};

/**
 * To use this function, no need to save driver's FCM token to database.
 * On mobile side, mobile need to subscribe to topic that has driver's unique identifier.
 *
 * on BE side, Card trx happens, then BE will need to check the card is assigned to which driver. Then take
 * the drivers UID/unique identifier that matches the one used by mobile. Then send the message to topic.
 *
 * This is the implementation because cards can be passed/binded to different drivers, so push notification
 * needs to be sent to the driver's currently associated with the card & active schedule
 *
 * @param token
 * @param title
 * @param message
 * @returns boolean to indicate success or fail
 */
export const sendMessageTopic = async (
  token: string,
  title: string,
  message?: string
) => {
  const sendTopicPayload: MessagingPayload = {
    notification: {
      title: title,
      body: message,
    },
  };

  const driverIdentifier = "driverUID/driver";
  const topic = `transaction-notification-${driverIdentifier}`;

  try {
    admin.messaging().sendToTopic(topic, sendTopicPayload);
  } catch (error) {
    console.log("ERROR: ", error);
  }

  return false;
};
