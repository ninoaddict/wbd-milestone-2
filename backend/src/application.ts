import express from "express";
import Controller from "@interfaces/controller";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import { PORT, ORIGIN, CREDENTIALS } from "./config";
import { errorMiddleware } from "./middlewares/error.middleware";

class Application {
  public app: express.Application;
  public port: string | undefined;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.port = PORT;
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use("/static", express.static("public"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(hpp());
    this.initRoutes(controllers);
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  private initRoutes(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
}

export default Application;
