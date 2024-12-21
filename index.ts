import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
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

app.listen(port, () => {
  console.log("app running in port", port);
});
