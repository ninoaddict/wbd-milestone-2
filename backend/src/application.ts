import express from "express";
import Controller from "@interfaces/controller";
import parser from "socket.io-msgpack-parser";
import { SocketServer, setupSocket } from "./socket/socket";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import { PORT } from "./config";
import { errorMiddleware } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

class Application {
  public app: express.Application;
  public port: string | undefined;
  private server: http.Server;
  public io: SocketServer;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.port = PORT || "3000";

    // Create the HTTP server
    this.server = http.createServer(this.app);

    // Initialize Socket.IO with WebSocket transport only
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
      parser,
      transports: ["websocket"],
    });

    // Middleware
    this.app.use(cors({ origin: "http://localhost:5173", credentials: true }));
    this.app.use("/storage", express.static("storage"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(hpp());
    this.app.use(cookieParser());
    this.initSocket();
    this.initSwagger();

    // Initialize routes and error handling
    this.initRoutes(controllers);

    this.app.use(errorMiddleware);
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  private initRoutes(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/api", controller.router);
    });
  }

  private initSocket() {
    this.io.on("connection", (socket) => {
      console.log(`Connection (${this.io.engine.clientsCount})`);
      socket.once("disconnect", () => {
        console.log(`Connection (${this.io.engine.clientsCount})`);
      });
    });

    setupSocket(this.io);

    process.on("SIGTERM", () => {
      console.log("SIGTERM");
      this.io.close();
    });
  }

  private initSwagger() {
    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "LinkedPurry API Documentation",
          version: "1.0.0",
          description: "This is the API documentation for LinkedPurry",
        },
        servers: [
          {
            url: `http://localhost:${this.port}`, // Replace with your base URL if needed
          },
        ],
      },
      apis: ["./src/controllers/*.ts"], // Path to your controller files for Swagger annotations
    };
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }
}

export default Application;
