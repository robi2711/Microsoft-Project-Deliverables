import express from "express";
import dbController from "@/controllers/dbController";

const router = express.Router();


router.post("/complex", dbController.createComplex);
router.get("/complex/:id", dbController.getComplex);
router.put("/complex/:id", dbController.updateComplex);
router.delete("/complex/:id", dbController.deleteComplex);
router.get("/complex", dbController.getComplexByAddress);
// Get all residents of a complex - to populate rows in residents management dashboard page.
router.get("/complex/:id/residents", dbController.getResidentsByComplexId);

router.post("/user", dbController.createUser);
router.get("/user/:id", dbController.getUser);
router.put("/user/:id", dbController.updateUser);
router.delete("/user/:id", dbController.deleteUser);

router.post("/admin", dbController.createAdmin);
router.get("/admin/:id", dbController.getAdmin);
router.put("/admin/:id", dbController.updateAdmin);
router.delete("/admin/:id", dbController.deleteAdmin);

export default router;
