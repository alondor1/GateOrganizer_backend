import express from "express";
import { getHistory, createHistory } from "../controllers/historyController.js";

const router = express.Router();

router.route("/").get(getHistory).post(createHistory);

export default router;
