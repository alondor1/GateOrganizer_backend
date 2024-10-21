import express from "express";
import {
  getEntries,
  createEntry,
  deleteEntry,
  updateEntryStatus,
  quickFormMethod,
  createEntryWithTokenAndExpire,
  CheckBlacklist,
} from "../controllers/entryController.js";

const router = express.Router();

router.route("/").get(getEntries).post(createEntry);
router.delete("/:id", deleteEntry);
router.put("/:id", updateEntryStatus);
router.post("/quickform", quickFormMethod);
router.post("/createwithtoken/:token", createEntryWithTokenAndExpire);
router.get("/check-blacklist/:token", CheckBlacklist);

export default router;
