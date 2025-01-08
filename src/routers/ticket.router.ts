import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";
import { verifyToken } from "../middleware/verifyToken";
import { uploader } from "../middleware/uploader";

export class TicketRouter {
  private route: Router;
  private ticketController: TicketController;

  constructor() {
    this.route = Router();
    this.ticketController = new TicketController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post(
      "/add-ticket",
      verifyToken,
      uploader("/ticketImg", "TIM").single("img"),
      this.ticketController.addTicket
    );
    this.route.patch(
      "/update/:id",
      verifyToken,
      uploader("/ticketImg", "TIM").single("img"),
      this.ticketController.UpdateTicket
    );
    this.route.get("/all-ticket", this.ticketController.getAllTicket);
    this.route.get(
      "/user-ticket",
      verifyToken,
      this.ticketController.getUserTicket
    );
    this.route.get(
      "/category-ticket/:category",
      this.ticketController.getCategoryticket
    );
    this.route.get(
      "/detail-ticket/:title",
      this.ticketController.getDetailTicket
    );
    // this.route.patch(
    //   "/update/:id",
    //   verifyToken,
    //   this.ticketController.updateTicket
    // );
    this.route.delete(
      "/delete-ticket/:id",
      verifyToken,
      this.ticketController.deleteTicket
    );
  }
  public getRouter(): Router {
    return this.route;
  }
}
