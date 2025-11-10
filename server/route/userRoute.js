import express from "express";
import {
    create,
    getAllUsers,
    login,
    getUser,
    updateUser,
    createBooking,
    getAllBookings,
    createContact,
    getAllContacts,
    deleteUser,
    getUserBookings,
    updateBooking,
    deleteBooking
} from "../controller/userController.js";



const route = express.Router();

// Auth routes
route.post("/user", create);
route.post("/login", login);

route.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send("Logout failed");
        res.clearCookie("connect.sid"); // clear the session cookie
        res.send("Logged out successfully");
    });
});

// Users
route.get("/users", getAllUsers);
route.get("/user/:id", getUser);       // get single user
route.put("/user/:id", updateUser);    // update user
route.delete("/user/:id", deleteUser);

// Bookings
route.post("/booking", createBooking);
route.get("/bookings", getAllBookings);
route.get("/booking/user/:id", getUserBookings);
route.put("/booking/:id", updateBooking);
route.delete("/booking/:id", deleteBooking);

// ContactUs
route.post("/contact", createContact);
route.get("/contacts", getAllContacts);

export default route;
