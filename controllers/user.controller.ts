import { Request, Response } from "express";
import { prisma } from "../config/prisma";

import { hashPassword } from "../utils/hashPassword";
import { compare, compareSync } from "bcrypt";

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const register = await prisma.users.create({
      data: { ...req.body, password: await hashPassword(req.body.password) },
    });

    return res.status(201).send({
      message: "Registration is success",
      success: true,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({
      message: "Registration is failed",
      success: false,
      error,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
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
    return res.status(200).send({
      username: findUser.username,
      email: findUser.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Login is failed",
      success: false,
      error,
    });
  }
};
