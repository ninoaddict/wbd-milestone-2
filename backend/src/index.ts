import Application from "./application";
import AuthController from "./controllers/auth.controller";
import ConnectionController from "./controllers/connection.controller";

const app = new Application([new AuthController(), new ConnectionController()]);
app.listen();
