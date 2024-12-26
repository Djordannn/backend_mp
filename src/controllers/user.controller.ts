import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { sign } from "jsonwebtoken";
import { hashPassword } from "../utils/hashPassword";
import { compare, compareSync } from "bcrypt";
import ResponseHandler from "../utils/response";
import { transporter } from "../config/nodemailer";
import { sendEmail } from "../utils/emailSender";
import { link } from "fs";
import { promises } from "dns";

export class UserController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const register = await prisma.users.create({
        data: { ...req.body, password: await hashPassword(req.body.password) },
      });

      const token = sign(
        { id: register.id, email: register.email },
        process.env.TOKEN_KEY || "test",
        {
          expiresIn: "1h",
        }
      );

      await sendEmail(req.body.email, "Registration Info", "register.hbs", {
        username: req.body.username,
        link: `${process.env.FE_URL}/verify?a_t=${token}`,
      });

      // await transporter.sendMail({
      //   from: "Admin",
      //   to: req.body.email,
      //   subject: "Registration Info",
      //   html: `<h1>Welcome ${req.body.username}!!</h1>`,
      // });

      ResponseHandler.success(res, "Registration is success", 201);
    } catch (error: any) {
      console.log(error);

      ResponseHandler.error(res, "Your registration is failed", error, 500);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const findUser = await prisma.users.findUnique({
        where: { email: req.body.email },
      });

      if (!findUser) {
        throw { rc: 404, message: "Account is not exist" };
      }

      // Check password
      const comparePass = compareSync(req.body.password, findUser.password);
      if (!comparePass) {
        throw { rc: 401, message: "Wrong password!!" };
      }

      // Generate token
      const token = sign(
        { id: findUser.id, email: findUser.email },
        process.env.TOKEN_KEY || "test"
      );

      return res.status(200).send({
        username: findUser.username,
        email: findUser.email,
        token,
      });
    } catch (error: any) {
      console.log(error);
      next({
        rc: error.rc || 500,
        message: "Login is failed",
        success: false,
        error,
      });
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const updateUser = await prisma.users.update({
        where: { id: res.locals.decript.id },
        data: { ...req.body, password: await hashPassword(req.body.password) },
      });

      if (!updateUser) {
        throw { rc: 404, message: "Account is not exist" };
      }

      // Generate token
      const token = sign(
        { id: updateUser.id, email: updateUser.email },
        process.env.TOKEN_KEY || "test"
      );

      return res.status(202).send({
        message: "Update user success",
        success: true,
        result: updateUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Update is failed",
        success: false,
        error,
      });
    }
  }

  async keepLogin(req: Request, res: Response): Promise<any> {
    try {
      // data from middleware token
      console.log("at keeplogin controller", res.locals.decript);
      const findUser = await prisma.users.findUnique({
        where: { id: res.locals.decript.id },
      });

      if (!findUser) {
        throw { rc: 404, message: "Account is not exist" };
      }

      // Generate token
      const token = sign(
        { id: findUser.id, email: findUser.email },
        process.env.TOKEN_KEY || "test"
      );

      return res.status(200).send({
        username: findUser.username,
        email: findUser.email,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Your keeplogin is failed",
        success: false,
        error,
      });
    }
  }

  async updatePhotoProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    console.log("File upload info : ", req.file);
    try {
      await prisma.users.update({
        where: { id: parseInt(res.locals.decript.id) },
        data: {
          imgProfile: `/profile/${req.file?.filename}`,
        },
      });

      ResponseHandler.success(res, "Upload profile is success!!");
    } catch (error) {
      next(error);
    }
  }
}
