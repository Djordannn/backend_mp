import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { registValidation } from "../middleware/validator";
import { verifyToken } from "../middleware/verifyToken";
import { uploader } from "../middleware/uploader";

export class UserRouter {
  private route: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
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
    this.route.post("/keep-login", this.userController.keepLogin);
    this.route.patch(
      "/photo-profile",
      verifyToken,
      uploader("/profile", "PRF").single("imgProfile"),
      this.userController.updatePhotoProfile
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
