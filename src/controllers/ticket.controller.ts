import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import ResponseHandler from "../utils/response";
import { connect } from "http2";

export class TicketController {
  async addTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      await prisma.tickets.create({
        data: {
          ...req.body,
          user: { connect: { id: parseInt(res.locals.decript.id) } },
          img: `/ticketProfile/${req.file?.filename}`,
        },
      });
      ResponseHandler.success(res, "Your ticket is success to add", 201);
    } catch (error) {
      console.log(error);

      ResponseHandler.error(res, "Your ticket is failed", error, 500);
    }
  }

  async UpdateTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    console.log("File upload info : ", req.file);
    try {
      const existingTicket = await prisma.tickets.findFirst({
        where: {
          userId: parseInt(res.locals.decript.id),
          title: req.params.title,
        },
      });

      if (!existingTicket) {
        return res.status(404).json({ message: "Ticket not found." });
      }

      await prisma.tickets.update({
        where: {
          id: existingTicket.id,
        },
        data: {
          ...req.body,
          img: `/ticketImg/${req.file?.filename}`,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
