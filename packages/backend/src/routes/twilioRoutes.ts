import express, { Router } from "express";
import twilioController from "@/controllers/twilioController";

const router: Router = express.Router();

// POST route for sending an SMS
router.post('/send', twilioController.sendSMS);

export default router;