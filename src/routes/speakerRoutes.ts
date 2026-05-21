import express from "express";
import {
  getSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} from "../controllers/speakerController.js";

const router = express.Router();

router.get("/", getSpeakers);
router.post("/", createSpeaker);
router.get("/:id", getSpeakerById);
router.put("/:id", updateSpeaker);
router.delete("/:id", deleteSpeaker);

export default router;
