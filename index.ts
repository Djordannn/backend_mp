import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./config/prisma";
dotenv.config();

const port = process.env.PORT;
const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response): any => {
  return res.status(200).send("ORM API");
});

app.get("/branch", async (req: Request, res: Response): Promise<any> => {
  try {
    const branches = await prisma.branch.findMany();

    res.status(200).send({
      message: "Get all branch",
      success: true,
      result: branches,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error get data",
      success: false,
    });
  }
});

app.listen(port, () => {
  console.log("app running in port", port);
});
