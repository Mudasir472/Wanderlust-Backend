const express = require("express");
const passport = require("passport")
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const User = require("../modals/userModal");
const { isAuthenticated } = require("../Middlewares")

const { storage } = require("../cloudConfig")
const multer = require('multer')
const upload = multer({ storage });

router.post("/listing/login", passport.authenticate('local'), async (req, res) => {
    try {
        // Access the session ID on the server side
        const sessionId = req.sessionID;
        res.status(200).json({ message: "Login successful", redirectUrl: "/", user: req.user, sessionId });

    } catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "Login failed", redirectUrl: "/login", error: e.message });
    }
});


router.post("/listing/signup", async (req, res) => {

    try {

        const { name, email, username, password } = req.body;
        const newUser = new User({ name, username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                console.log('Login error after signup:', err);
                return res.status(500).json({ message: "Login after signup failed", redirectUrl: "/login" });
            }
            const sessionId = req.sessionID;
            res.status(200).json({ message: "Signup successful", redirectUrl: "/", sessionId });
            console.log('Signup successful');
        });

    } catch (e) {
        console.log(e.message);
        res.status(400).json({ message: "Signup failed", redirectUrl: "/signup", error: e.message });
    }
})

router.post("/listing/logout", (req, res) => {
    req.logOut((err) => {
        if (err) {
            res.send(err);
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Logout successful", redirectUrl: "/", });
    })
})
router.get("/listing/profile", isAuthenticated, (req, res) => {
    res.status(200).json({ message: "user profile", user: req.user })
})
router.get("/listing/detail",(req, res) => {
    res.status(200).json({ message: "user detail", user: req.user })
})

router.post("/listing/changeprofile", isAuthenticated, upload.single("profilePic"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        // Assuming req.user contains the logged-in user's information
        const userId = req.user._id;
        const filePath = req.file.path; // Path to the uploaded file

        // Update the user's profile picture in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 'image.url': filePath }, // Update the image URL field; adjust field as per your schema
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: "Profile picture updated successfully!", user: updatedUser });
    } catch (error) {
        console.error('Error uploading the file:', error);
        res.status(500).json({ message: "Failed to update profile picture", error: error.message });
    }
});

module.exports = router;