import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // decript token from header
    console.log("from request header", req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      throw { rc: 404, status: false, message: "Token not exist" };
    }

    const checkToken = verify(token, process.env.TOKEN_KEY || "test");
    console.log(checkToken);

    res.locals.decript = checkToken;
    //Meneruskan proses ke controller selanjutnya
    next();
  } catch (error: any) {
    res.status(401).send({
      message: "Unauthorized token, is invalid",
      success: false,
    });
  }
};
