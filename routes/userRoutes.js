import express from "express";
import {
  getUsers,
  createUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(getUsers).post(createUser);
router.delete("/:id", deleteUser);

export default router;
