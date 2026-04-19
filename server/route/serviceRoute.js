import express from "express";
import {
    getCustomServices,
    addCustomService,
    updateCustomService,
    deleteCustomService,
    getServicePackages,
    updateServicePackage,
    initializeServicePackages
} from "../controller/serviceController.js";

const router = express.Router();

// Custom Services Routes
router.get("/custom", getCustomServices);
router.post("/custom", addCustomService);
router.put("/custom/:id", updateCustomService);
router.delete("/custom/:id", deleteCustomService);

// Service Packages Routes
router.get("/packages", getServicePackages);
router.put("/packages/:id", updateServicePackage);
router.post("/packages/initialize", initializeServicePackages);

export default router;