import User from "../model/userModel.js";
import Booking from "../model/bookModel.js";
import Contact from "../model/contactmodel.js";

export const create = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const { email } = newUser;

        // check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        const savedData = await newUser.save();

        // hide password in response
        const { password, ...userWithoutPassword } = savedData.toObject();

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: userWithoutPassword,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const userData = await User.find();
        if (!userData || userData.length === 0) {
            return res.status(404).json({ success: false, message: "User data not found" });
        }
        res.status(200).json({
            success: true,
            users: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // check password (plain for now, later hash with bcrypt)
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // hide password
        const { password: pwd, ...userWithoutPassword } = user.toObject();

        // ✅ Save session
        req.session.user = userWithoutPassword;

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single user by ID
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password'); // hide password
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Update user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');

        if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();

        res.status(201).json({
            success: true,
            message: "Booking created successfully!",
            data: savedBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: error.message
        });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user_id", "firstName middleName lastName email contactNumber") // populate user details
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Create new contact
export const createContact = async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        const savedContact = await newContact.save();

        res.status(201).json({
            success: true,
            message: "Contact submitted successfully!",
            data: savedContact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to submit contact",
            error: error.message,
        });
    }
};

// Get all contact messages (for admin)
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Delete user by ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getUserBookings = async (req, res) => {
    try {
        const { id } = req.params; // logged in user id
        const bookings = await Booking.find({ user_id: id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Update Booking
export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Booking.findByIdAndUpdate(id, req.body, { new: true });

        if (!updated) return res.status(404).json({ success: false, message: "Booking not found" });

        res.status(200).json({ success: true, message: "Booking updated successfully!", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Booking
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Booking.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Booking not found" });

        res.status(200).json({ success: true, message: "Booking deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



