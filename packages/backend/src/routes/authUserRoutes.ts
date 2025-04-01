import express from "express";
import { Router } from "express";
import authController from "@/controllers/authUserController";

const router: Router = express.Router();

router.post('/signUp', authController.signUp);

export default router;