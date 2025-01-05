import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import ResponseHandler from "../utils/response";
import { connect } from "http2";
import { Result } from "express-validator";

export class TicketController {
  async addTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const price = parseInt(req.body.price, 10);
      await prisma.tickets.create({
        data: {
          ...req.body,
          price: price,
          user: { connect: { id: parseInt(res.locals.decript.id) } },
          img: `/ticketImg/${req.file?.filename}`,
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

  async getAllTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const data = await prisma.tickets.findMany();

      return res.status(200).send({
        message: "Get all data success",
        success: true,
        result: data,
      });
    } catch (error) {
      ResponseHandler.error(res, "Get data failed", error, 500);
    }
  }
  async getSearchTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const searchQuery = req.params.title as string;

    try {
      const data = await prisma.tickets.findMany({
        where: {
          title: { contains: searchQuery, mode: "insensitive" },
        },
      });

      return res.status(200).send({
        message: "Get all data success",
        success: true,
        result: data,
      });
    } catch (error) {
      ResponseHandler.error(res, "Get data failed", error, 500);
    }
  }

  async getSport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const data = await prisma.tickets.findMany({
        where: { category: "Sport" },
      });

      return res.status(200).send({
        message: "Get sport data success",
        success: true,
        result: data,
      });
    } catch (error) {
      ResponseHandler.error(res, "Data sport not found", 404);
    }
  }

  async getMusic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const data = await prisma.tickets.findMany({
        where: { category: "Music" },
      });

      return res.status(200).send({
        message: "Get music data success",
        success: true,
        result: data,
      });
    } catch (error) {
      ResponseHandler.error(res, "Data music not found", 404);
    }
  }

  async getWorkshop(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const data = await prisma.tickets.findMany({
        where: { category: "Workshop" },
      });

      return res.status(200).send({
        message: "Get workshop data success",
        success: true,
        result: data,
      });
    } catch (error) {
      ResponseHandler.error(res, "Data workshop not found", 404);
    }
  }
}
