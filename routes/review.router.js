const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../modals/listingModal.js");
const Review = require("../modals/reviewModal.js");
const { isAuther, isAuthenticated } = require("../Middlewares.js")

router.post("/review/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { comment, rating } = req.body;
    // Basic validation
    // if (!req.user || !req.user._id) {
    //     return res.status(401).json({ msg: "User not " });
    // }
    if (!comment || !rating) {
        return res.status(400).json({ msg: "Comment and rating are required" });
    }
    try {
        const listing = await Listing.findById(id);
        // Check if the listing exists
        if (!listing) {
            return res.status(404).json({ msg: "Listing not found" });
        }
        // Create a new review
        const newReview = new Review({ comment, rating, author: req.user._id });
        // Save the new review and add it to the listing
        await newReview.save();
        listing.review.push(newReview);
        await listing.save();
        res.status(200).json({ msg: "Review added successfully" });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.delete("/:Lid/delReview/:Rid", isAuthenticated, async (req, res) => {
    const { Lid, Rid } = req.params;
    await Listing.findByIdAndUpdate(Lid, { $pull: { review: Rid } });
    await Review.findByIdAndDelete(Rid);
    if (!Review) {
        res.status(401).json({ msg: "Delete Failed" })
    }
    res.status(200).json({ msg: "Review Deletes" })
})
module.exports = router;
