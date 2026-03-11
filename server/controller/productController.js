import Product from "../model/productModel.js";
import multer from "multer";
import path from "path";

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/productimages/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    },
});

/* GET ALL PRODUCTS */
export const getProducts = async (req, res) => {
    try {

        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};


/* GET SINGLE PRODUCT */
export const getProductById = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};


/* ADD PRODUCT (Admin) */
export const addProduct = async (req, res) => {
    try {
        const { name, price, oldPrice, category, rating, description } = req.body;

        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Product image is required" });
        }

        const newProduct = new Product({
            name,
            price,
            oldPrice: oldPrice || null,
            category,
            rating,
            description,
            image: req.file.filename, // Save only the filename
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Product added successfully",
            product: savedProduct,
        });
    } catch (error) {
        console.error("Add product error:", error);
        res.status(500).json({ message: error.message });
    }
};


/* UPDATE PRODUCT */
export const updateProduct = async (req, res) => {

    try {

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedProduct);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};


/* DELETE PRODUCT */
export const deleteProduct = async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Product deleted" });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};