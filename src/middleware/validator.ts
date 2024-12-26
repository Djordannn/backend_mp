import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import ResponseHandler from "../utils/response";

export const registValidation = [
  body("username").notEmpty(),
  body("email").notEmpty().isEmail().withMessage("Email is required"),
  body("password").notEmpty().isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  }),
  (req: Request, res: Response, next: NextFunction): any => {
    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
      return ResponseHandler.error(
        res,
        "Your data is invalid",
        errorValidation,
        400
      );
    }
    next();
  },
];
