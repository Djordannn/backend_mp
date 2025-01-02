import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { TicketController } from "../controllers/ticket.controller";
import { registValidation } from "../middleware/validator";
import { verifyToken } from "../middleware/verifyToken";
import { uploader } from "../middleware/uploader";

export class UserRouter {
  private route: Router;
  private userController: UserController;
  private ticketController: TicketController;

  constructor() {
    this.userController = new UserController();
    this.ticketController = new TicketController();
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post(
      "/register",
      registValidation,
      this.userController.register
    );
    this.route.post("/login", this.userController.login);
    this.route.patch("/update/:id", this.userController.update);
    this.route.get("/keep-login", verifyToken, this.userController.keepLogin);
    this.route.patch(
      "/photo-profile",
      verifyToken,
      uploader("/profile", "PRF").single("imgProfile"),
      this.userController.updatePhotoProfile
    );
    this.route.patch(
      "/verify-account",
      verifyToken,
      this.userController.verifiedAccount
    );
    this.route.post(
      "/add-ticket",
      verifyToken,
      this.ticketController.addTicket
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
