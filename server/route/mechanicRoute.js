import express from "express";
import * as mechanicController from "../controller/mechanicController.js";

const router = express.Router();

router.post("/mechanics", mechanicController.addMechanic);
router.get("/mechanics", mechanicController.getAllMechanics);
router.get("/mechanics/available", mechanicController.getAvailableMechanics);
router.put("/mechanics/:id", mechanicController.updateMechanic);
router.delete("/mechanics/:id", mechanicController.deleteMechanic);

export default router;
