import { Router } from "express";
import {
  authenticate,
  sendMessage,
} from "../controllers/whatsapp.controllers.js";

const router = Router();

router.post("/authenticate", authenticate);
router.post("/send-message", sendMessage);

export default router;
