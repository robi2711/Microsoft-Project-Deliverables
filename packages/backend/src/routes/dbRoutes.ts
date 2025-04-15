import express from "express";
import dbController from "@/controllers/dbController";

const router = express.Router();


router.post("/complex", dbController.createComplex);
router.get("/complex/:id", dbController.getComplex);
router.put("/complex/:id", dbController.updateComplex);
router.delete("/complex/:id", dbController.deleteComplex);
router.get("/complex", dbController.getComplexByAddress);

router.post("/user", dbController.createUser);
router.get("/user/:id", dbController.getUser);
router.get("/user/phone/:number", dbController.getUserByNumber);
router.get("/user/complex", dbController.getUsersByComplex);
router.put("/user/:id", dbController.updateUser);
router.delete("/user/:id", dbController.deleteUser);

router.post("/admin", dbController.createAdmin);
router.get("/admin/:id", dbController.getAdmin);
router.put("/admin/:id", dbController.updateAdmin);
router.delete("/admin/:id", dbController.deleteAdmin);

router.get("/contract", dbController.getContract);
router.post("/contract", dbController.createContract);
router.put("/contract/:id/:phone", dbController.updateContract);
router.delete("/contract/:id/:phone", dbController.deleteContract);

export default router;
