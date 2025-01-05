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
      "/img-Ticket/:title",
      verifyToken,
      uploader("/ticketImg", "TIM").single("img"),
      this.ticketController.UpdateTicket
    );
    this.route.get("/all-ticket", this.ticketController.getAllTicket);
    this.route.get(
      "/search-ticket/:title",
      this.ticketController.getSearchTicket
    );
    this.route.get("/sport", this.ticketController.getSport);
    this.route.get("/music", this.ticketController.getMusic);
    this.route.get("/workshop", this.ticketController.getWorkshop);
  }
  public getRouter(): Router {
    return this.route;
  }
}
