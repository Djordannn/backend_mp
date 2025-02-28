import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, Application, NextFunction } from "express";
import cors from "cors";
import ResponseHandler from "./utils/response";
import { UserRouter } from "./routers/user.router";
import { TicketRouter } from "./routers/ticket.router";
import path from "path";
import { prisma } from "./config/prisma";
import { Result } from "express-validator";
const PORT = process.env.PORT || 8085;

class App {
  readonly app: Application;

  constructor() {
    this.app = express();
    this.configure(); // Running configure
    this.routes();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use("/", express.static(path.join(__dirname, "../public")));
  }

  private routes(): void {
    const userRouter = new UserRouter();
    const ticketRouter = new TicketRouter();
    this.app.get("/", (req: Request, res: Response): any => {
      return res.status(200).send("ORM API");
    });

    this.app.use("/user", userRouter.getRouter());
    this.app.use("/ticket", ticketRouter.getRouter());
  }

  private errorHandler(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        ResponseHandler.error(res, error.message, error.error, error.rc);
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log("app running in port", PORT);
    });
  }
}

export default new App();
