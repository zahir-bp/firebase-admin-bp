import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { sendMessageToken } from "./firebase-admin/firebase-admin-config";

require("dotenv").config();

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

app.get("/send-fcm", async (_req: Request, res: Response) => {
  // iphone 16 sim
  // const dummyToken =
  //   "fxdc_q32pk-bg3-CHZDvGN:APA91bFurWOvpKxH5ibKHND43ltZHwLEqAiahid7Ww7U-PNfszOS5Nk4K8NgfAkMIcRJY-l7T1arFId1Z3EyZjqSl0exGa8rMbN6ytvtqnt1INcfJLWNRBA";

  // samsung a23
  const dummyToken =
    "eDPtfHrRTrO9J9UYP0VQPX:APA91bFKzmRgf6Y-SVV77s95eLTcMcaRxcRWGTEzLhcoSJ7mxGS6vVrVAtBBL68_1TWLa7SoUp2_W-afjJHfDITH3MYcf1P_fAwOk1r6pR1qCYJrvSjsXzk";
  const dummyTitle = "transaction approved";
  const dummyBody =
    "your card transaction ending 9018 has been charged RM 280. Please contact customer support if its not you.";

  const response = sendMessageToken(dummyToken, dummyTitle, dummyBody);
  if (response) {
    return res.send("Message send successfully");
  }

  return res.send("Message failed to send");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
