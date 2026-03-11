import express from "express";
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    upload
} from "../controller/productController.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/add", upload.single("image"), addProduct);

router.put("/update/:id", updateProduct);

router.delete("/delete/:id", deleteProduct);

export default router;