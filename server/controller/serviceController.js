import { CustomService, ServicePackage } from "../model/serviceModel.js";

// Custom Services Controllers

// Get all custom services
export const getCustomServices = async (req, res) => {
    try {
        const services = await CustomService.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            services
        });
    } catch (error) {
        console.error("Error fetching custom services:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching custom services",
            error: error.message
        });
    }
};

// Add new custom service
export const addCustomService = async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Name and price are required"
            });
        }

        // Check if service with same name already exists
        const existingService = await CustomService.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            isActive: true 
        });

        if (existingService) {
            return res.status(400).json({
                success: false,
                message: "Service with this name already exists"
            });
        }

        const newService = new CustomService({
            name: name.trim(),
            price: parseInt(price)
        });

        const savedService = await newService.save();

        res.status(201).json({
            success: true,
            message: "Custom service added successfully",
            service: savedService
        });
    } catch (error) {
        console.error("Error adding custom service:", error);
        res.status(500).json({
            success: false,
            message: "Error adding custom service",
            error: error.message
        });
    }
};

// Update custom service
export const updateCustomService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Name and price are required"
            });
        }

        // Check if another service with same name exists (excluding current service)
        const existingService = await CustomService.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            isActive: true,
            _id: { $ne: id }
        });

        if (existingService) {
            return res.status(400).json({
                success: false,
                message: "Service with this name already exists"
            });
        }

        const updatedService = await CustomService.findByIdAndUpdate(
            id,
            { 
                name: name.trim(), 
                price: parseInt(price),
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Custom service updated successfully",
            service: updatedService
        });
    } catch (error) {
        console.error("Error updating custom service:", error);
        res.status(500).json({
            success: false,
            message: "Error updating custom service",
            error: error.message
        });
    }
};

// Delete custom service (soft delete)
export const deleteCustomService = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedService = await CustomService.findByIdAndUpdate(
            id,
            { 
                isActive: false,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!deletedService) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Custom service deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting custom service:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting custom service",
            error: error.message
        });
    }
};

// Service Packages Controllers

// Get all service packages
export const getServicePackages = async (req, res) => {
    try {
        const packages = await ServicePackage.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            packages
        });
    } catch (error) {
        console.error("Error fetching service packages:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching service packages",
            error: error.message
        });
    }
};

// Update service package
export const updateServicePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, description } = req.body;

        if (!price) {
            return res.status(400).json({
                success: false,
                message: "Price is required"
            });
        }

        const updatedPackage = await ServicePackage.findByIdAndUpdate(
            id,
            { 
                price: parseInt(price),
                description: description || "",
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({
                success: false,
                message: "Service package not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service package updated successfully",
            package: updatedPackage
        });
    } catch (error) {
        console.error("Error updating service package:", error);
        res.status(500).json({
            success: false,
            message: "Error updating service package",
            error: error.message
        });
    }
};

// Initialize default service packages (run once)
export const initializeServicePackages = async (req, res) => {
    try {
        const defaultPackages = [
            { name: "General Service", price: 499, description: "Complete bike checkup including oil change, brake adjustment, and basic maintenance" },
            { name: "All-over Service", price: 999, description: "Comprehensive service with engine tuning, full inspection, and premium parts replacement" },
            { name: "Basic Service", price: 199, description: "Basic services like tyre inflating, headlight setting, brake setting, clutch setting" }
        ];

        for (const pkg of defaultPackages) {
            const existingPackage = await ServicePackage.findOne({ name: pkg.name });
            if (!existingPackage) {
                await ServicePackage.create(pkg);
            }
        }

        res.status(200).json({
            success: true,
            message: "Service packages initialized successfully"
        });
    } catch (error) {
        console.error("Error initializing service packages:", error);
        res.status(500).json({
            success: false,
            message: "Error initializing service packages",
            error: error.message
        });
    }
};