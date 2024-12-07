import webPush from "web-push";
import { PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } from ".";

webPush.setVapidDetails(
  "mailto:adrilbless37@gmail.com",
  PUBLIC_VAPID_KEY || "",
  PRIVATE_VAPID_KEY || ""
);

export default webPush;
