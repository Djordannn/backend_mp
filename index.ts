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
    const branches = await prisma.branch.findMany({ where: req.query });

    res.status(200).send({
      message: "Get all branch",
      success: true,
      result: branches,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error get branch",
      success: false,
    });
  }
});

app.post("/branch", async (req: Request, res: Response): Promise<any> => {
  try {
    const branches = await prisma.branch.create({ data: req.body });
    res.status(200).send({
      message: "Add branch success",
      success: true,
      result: branches,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error add branch",
      success: false,
    });
  }
});

app.patch("/branch/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const branches = await prisma.branch.update({
      data: req.body,
      where: { id: parseInt(req.params.id) },
    });

    res.status(200).send({
      message: "Update branch success",
      success: true,
      result: branches,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error update branch",
      success: false,
    });
  }
});

app.listen(port, () => {
  console.log("app running in port", port);
});
