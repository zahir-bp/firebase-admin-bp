import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { sendMessageTopic } from "./firebase-admin/firebase-admin-config";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

// app.get("/send", async (_req: Request, res: Response) => {
//   try {
//     // iphone 16 sim
//     // const dummyToken =
//     //   "fxdc_q32pk-bg3-CHZDvGN:APA91bFurWOvpKxH5ibKHND43ltZHwLEqAiahid7Ww7U-PNfszOS5Nk4K8NgfAkMIcRJY-l7T1arFId1Z3EyZjqSl0exGa8rMbN6ytvtqnt1INcfJLWNRBA";

//     // samsung a23
//     // const dummyToken =
//     //   "d3U-s7wUT7SYJmxwYi7gar:APA91bHvYXviC4j5mTqMe5m7Y8Go81E2IwsiI2pgHtcT56OgXDA97ndajAUWfMeunHnM2X3t9E9qwwGg0hAqTcz-APzSC1YHpJdeKIONzpvnaF6qbm2EhYw";
//     const dummyToken =
//       "f45CiPY7TTSBndOFSDvVfU:APA91bEt 3tIWFAja2VFG-Pr5XVwRLMJjdt1lrD_BnvViySNmdlcKXsotFJ9M8tpNp6f2Vt0xy8 wHFuCuGA7D4GeAwT2loi4-qhReQXeU2ZS3ilVRe9il4jE";
//     const notificationTitle = "transaction approved";
//     const notificationBody =
//       "your card transaction ending 8171 has been charged RM 9000. Please contact customer support if its not you.";

//     const response = sendMessageToken(
//       dummyToken,
//       notificationTitle,
//       notificationBody
//     );
//     if (response) {
//       return res.send("Message send successfully");
//     }
//   } catch (error) {
//     console.log(">>> error", error);
//   }

//   return res.send("Message failed to send");
// });

app.post("/send-topic", async (_req: Request, res: Response) => {
  try {
    const { title, body, topic } = _req.body;

    // needs to have a topic. because function used is notification to anyone who subscribed to topics
    if (topic) {
      const notificationTitle = title || "BayaPay";
      const notificationBody =
        body ||
        "Your card had a transaction. Please contact customer support if its not you.";

      const response = await sendMessageTopic(
        topic,
        notificationTitle,
        notificationBody
      );
      if (response) {
        return res.send("Message send successfully");
      }
    }
  } catch (error) {
    console.log(">>> error", error);
  }

  return res.send("Message failed to send");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
