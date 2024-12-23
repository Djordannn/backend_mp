import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { prisma } from "./config/prisma";
import cors from "cors";
import userRouter from "./routers/user.router";
dotenv.config();

const port = process.env.PORT;
const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response): any => {
  return res.status(200).send("ORM API");
});

// #route
app.use("/user", userRouter);

app.get("/data", async (req: Request, res: Response): Promise<any> => {
  try {
    const data = await prisma.users.findMany();
    return res.status(200).send({
      message: "Get all data users",
      success: true,
      result: data,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("app running in port", port);
});
