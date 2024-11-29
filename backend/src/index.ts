import Application from "./application";
import AuthController from "./controllers/auth.controller";
import ConnectionController from "./controllers/connection.controller";
import FeedController from "./controllers/feed.controller";
import ProfileController from "./controllers/profile.controller";

const app = new Application([
  new AuthController(),
  new ConnectionController(),
  new ProfileController(),
  new FeedController(),
]);
app.listen();
