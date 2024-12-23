import { Router } from "express";
import {
  register,
  login,
  update,
  keepLogin,
} from "../controllers/user.controller";
import { verifyToken } from "../middleware/verifyToken";

const route = Router();

route.post("/register", register);
route.post("/login", login);
route.patch("/update/:id", update);
route.get("/keep-login", verifyToken, keepLogin);

export default route;
