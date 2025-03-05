import express, { Router } from "express";
import dbController from "@/controllers/dbController";
import dbGet from "@/controllers/dbGet";

const router: Router = express.Router();

// POST route for creating a user
router.post('/create', dbController.createUser);

// GET route for retrieving a customer by name or address
router.get('/get', dbGet);

export default router;
