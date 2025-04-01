import express from "express";
import { Router } from "express";
import authController from "@/controllers/authController";

const router: Router = express.Router();

router.post('/signUpUser', authController.signUpUser);


router.post('/signUpAdmin', authController.signUpAdmin);

router.post('/signOutAdmin', authController.signOutAdmin);

router.post('/signInAdmin', authController.signInAdmin)


export default router;