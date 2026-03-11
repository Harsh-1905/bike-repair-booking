import Mechanic from "../model/mechanicModel.js";

// Add new mechanic
export const addMechanic = async (req, res) => {
    try {
        const { fullName, address, phone, email, yearsOfExperience } = req.body;

        // Check if mechanic already exists
        const existingMechanic = await Mechanic.findOne({ email });
        if (existingMechanic) {
            return res.status(400).json({ message: "Mechanic with this email already exists" });
        }

        const newMechanic = new Mechanic({
            fullName,
            address,
            phone,
            email,
            yearsOfExperience,
        });

        await newMechanic.save();

        res.status(201).json({
            message: "Mechanic added successfully",
            mechanic: newMechanic,
        });
    } catch (error) {
        console.error("Add mechanic error:", error);
        res.status(500).json({ message: "Failed to add mechanic", error: error.message });
    }
};

// Get all mechanics
export const getAllMechanics = async (req, res) => {
    try {
        const mechanics = await Mechanic.find().sort({ createdAt: -1 });
        res.status(200).json(mechanics);
    } catch (error) {
        console.error("Get mechanics error:", error);
        res.status(500).json({ message: "Failed to fetch mechanics", error: error.message });
    }
};

// Get available mechanics
export const getAvailableMechanics = async (req, res) => {
    try {
        const mechanics = await Mechanic.find({ isAvailable: true }).sort({ createdAt: -1 });
        res.status(200).json(mechanics);
    } catch (error) {
        console.error("Get available mechanics error:", error);
        res.status(500).json({ message: "Failed to fetch mechanics", error: error.message });
    }
};

// Update mechanic
export const updateMechanic = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMechanic = await Mechanic.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedMechanic) {
            return res.status(404).json({ message: "Mechanic not found" });
        }

        res.status(200).json({
            message: "Mechanic updated successfully",
            mechanic: updatedMechanic,
        });
    } catch (error) {
        console.error("Update mechanic error:", error);
        res.status(500).json({ message: "Failed to update mechanic", error: error.message });
    }
};

// Delete mechanic
export const deleteMechanic = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMechanic = await Mechanic.findByIdAndDelete(id);

        if (!deletedMechanic) {
            return res.status(404).json({ message: "Mechanic not found" });
        }

        res.status(200).json({ message: "Mechanic deleted successfully" });
    } catch (error) {
        console.error("Delete mechanic error:", error);
        res.status(500).json({ message: "Failed to delete mechanic", error: error.message });
    }
};
