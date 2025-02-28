import express from "express";
import { Router } from "express";
import tmpController from "@/controllers/tmpController";

const router: Router = express.Router(); // This is the router that will be used to create the endpoints

router.post('/randomCommand', tmpController.randomCommand); // This is the endpoint that the frontend will use to make requests to the backend

export default router; // This exports the router so that it can be used in other files