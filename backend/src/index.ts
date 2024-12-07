import Application from "./application";
import AuthController from "./controllers/auth.controller";
import ChatController from "./controllers/chat.controller";
import ConnectionController from "./controllers/connection.controller";
import FeedController from "./controllers/feed.controller";
import NotificationController from "./controllers/notification.controller";
import ProfileController from "./controllers/profile.controller";

const app = new Application([
  new AuthController(),
  new ConnectionController(),
  new ProfileController(),
  new ChatController(),
  new FeedController(),
  new NotificationController(),
]);
app.listen();
