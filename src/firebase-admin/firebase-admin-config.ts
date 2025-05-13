import {
  Message,
  MessagingPayload,
  TokenMessage,
} from "firebase-admin/lib/messaging/messaging-api";
import firebaseAdmin from "../../clientInit/firebase-admin-client";

// /**
//  * To use this function, will need to save driver's FCM token to database.
//  * Will need to generate the value during login flow.
//  *
//  * Card trx happens, then BE will need to check the card is assigned to which driver. Then take
//  * the driver's FCM token (saved during driver's first time login) and send the message.
//  *
//  * @param token
//  * @param title
//  * @param message
//  * @returns boolean to indicate success or fail
//  */
// export const sendMessageToken = async (
//   token: string,
//   title: string,
//   message?: string
// ) => {
//   const sendTokenPayload: TokenMessage = {
//     token: token,
//     notification: {
//       title: title,
//       body: message,
//     },
//     android: {
//       priority: "high",
//     },
//   };

//   try {
//     firebaseAdmin
//       .messaging()
//       .send(sendTokenPayload)
//       .then((response) => {
//         if (response) {
//           return true;
//         }
//       });

//     console.log("sendMessageToken run");
//   } catch (error) {
//     console.log("ERROR: ", error);
//   }

//   return false;
// };

export const cleanDriverIdForTopic = (uid: string) => {
  const UNWANTED_NOTIFICATION_TOPIC_REGEX = /[a-zA-Z0-9]/g;
  const specialChars = uid.replaceAll(UNWANTED_NOTIFICATION_TOPIC_REGEX, "");

  let matched = uid;

  specialChars.split("").forEach((char: string) => {
    matched = matched.replaceAll(char, "");
  });

  return matched;
};

/**
 * To use this function, NO NEED to save driver's FCM token to database.
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
  messageTopic: string,
  title: string,
  notificationMessage?: string
) => {
  // topics cannot have special chars. will throw error code: 'messaging/invalid-payload', message: 'Malformed topic name'
  // uid from "u#1722581598358-yC8NTYolaOkF" > "u1722581598358-yC8NTYolaOkF"
  // const topic = `card-trx-${driverIdentifier}`;
  const topic = messageTopic || "";

  // ? better use notification params. its a higher priority message than data
  // ? notification params will make sure device will handle the notification if app is kill or not open for some time
  // ! using notification params wil cause mobile to receive 2 same notification. what to do here ?
  // to note: this use case will be handled by device, but will also trigger setBackgroundMessageHandler listener. so mobile needs
  // to automatically hide notifee message if the app is not on the foreground. notifee notification is needed to show the pop up banner

  // ? so, mobile needs to access from remoteMessage?.notification
  // mobile will access remoteMessage?.notification, then show notification using notifee (to show the pop up & a banner in notification banner)

  // no choice but to use notification on firebase admin backend side, because if use data param, after 5 min app is killed,
  // if backend send notification, no notification banner shown
  // & by using notification param, mobile can expand the message in full, compared to using data(handled by notifee)

  const sendTopicPayload: Message = {
    notification: {
      title: `notification-${title}`,
      body: notificationMessage,
    },
    topic: topic,
    android: {
      priority: "high",
    },
  };

  try {
    firebaseAdmin
      .messaging()
      .send(sendTopicPayload)
      .then((res) => {
        console.log("res", JSON.stringify(res));
      });
  } catch (error) {
    console.log("ERROR: ", error);
  }

  return false;
};
