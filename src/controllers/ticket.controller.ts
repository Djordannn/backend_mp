import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";
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
          id: parseInt(req.params.id),
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
          price: parseInt(req.body.price),
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
      const data = await prisma.tickets.findMany({});

      return res.status(200).send({
        message: "Get all data success",
        success: true,
        result: data,
      });
    } catch (error) {
      ResponseHandler.error(res, "Get data failed", error, 500);
    }
  }
  async getUserTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const data = await prisma.tickets.findMany({
        where: { userId: res.locals.decript.id },
      });

      return res.status(200).send({
        message: "Get ticket user success",
        success: true,
        result: data,
      });
    } catch (error) {
      ResponseHandler.error(res, "Get ticket user failed", error, 500);
    }
  }
  async getCategoryticket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const data = await prisma.tickets.findMany({
        where: {
          category: req.params.category,
        },
      });

      return res.status(200).send({
        message: "Get data from category success",
        success: true,
        result: data,
      });
    } catch (error) {
      ResponseHandler.error(res, "Get data failed", error, 500);
    }
  }

  async getDetailTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      if (!req.params.title) {
        return res.status(400).send({
          message: "Title is required",
          success: false,
        });
      }

      const data = await prisma.tickets.findFirst({
        where: {
          title: req.params.title,
        },
      });

      if (!data) {
        return res.status(404).send({
          message: "Ticket not found",
          success: false,
        });
      }

      return res.status(200).send({
        message: "Get detail data success",
        success: true,
        result: data,
      });
    } catch (error) {
      return res.status(500).send({
        message: "Get data failed",
        success: false,
        Result: error,
      });
    }
  }

  async deleteTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const data = await prisma.tickets.delete({
        where: { id: parseInt(req.params.id), userId: res.locals.decript.id },
      });

      return res.status(200).send({
        message: "Delete ticket success",
        success: true,
        result: data,
      });
    } catch (error) {
      ResponseHandler.error(res, "Delete ticket user failed", error, 500);
    }
  }
}
