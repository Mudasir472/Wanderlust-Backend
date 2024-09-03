const express = require("express");
const router = express.Router({ mergeParams: true });
const cookieParser = require("cookie-parser");
const Listing = require("../modals/listingModal")
const wrapAsync = require("../utils/wrapAsync");
const { isAuthenticated, saveRedirectUrl } = require("../Middlewares");

const { storage } = require("../cloudConfig")
const multer = require('multer')
const upload = multer({ storage });

router.get("/", (req, res) => {
    res.send("i am at root in the router")
});
router.get("/listings", wrapAsync(async (req, res) => {
    const listings = await Listing.find({}).populate({
        path: 'review',
        populate: {
            path: 'author',
            select: 'name', // Ensure you're selecting the 'name' field from User
        }
    });
    res.send(listings)
}));

router.put("/edit/:id", isAuthenticated, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body })
    res.status(200).json({ msg: "update success"});
})
router.delete("/delete/:id", isAuthenticated, saveRedirectUrl, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.status(200).json({ msg: "deleted successfully" })
})

module.exports = router;