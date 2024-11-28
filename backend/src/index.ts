import Application from "./application";
import AuthController from "./controllers/auth.controller";
import ChatController from "./controllers/chat.controller";
import ConnectionController from "./controllers/connection.controller";
import ProfileController from "./controllers/profile.controller";

const app = new Application([
  new AuthController(),
  new ConnectionController(),
  new ProfileController(),
  new ChatController(),
]);
app.listen();
