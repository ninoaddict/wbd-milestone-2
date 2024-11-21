import Application from "./application";
import AuthController from "./controllers/auth.controller";

const app = new Application([new AuthController()]);
app.listen();
