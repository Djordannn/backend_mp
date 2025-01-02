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
        },
      });
      ResponseHandler.success(res, "Your ticket is success to add", 201);
    } catch (error) {
      console.log(error);

      ResponseHandler.error(res, "Your ticket is failed", error, 500);
    }
  }
}
