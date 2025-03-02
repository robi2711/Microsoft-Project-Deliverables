import express from "express";
import { Router } from "express";
import dbController from "@/controllers/dbController";

const router: Router = express.Router(); // This is the router that will be used to create the endpoints

router.post('/create', dbController.createItem);

export default router; // This exports the router so that it can be used in other files