import express, { Router } from "express";
import dbController from "@/controllers/dbController";

const router: Router = express.Router();

// POST route for creating a user
router.post('/create', dbController.createUser);

// GET route for retrieving a customer by name or address
router.get('/get', dbController.getCustomer);

// PUT route for updating a user by id
router.put('/update/:id', dbController.updateUser);

// DELETE route for removing a user by id
router.delete('/remove/:id', dbController.removeUser);

export default router;