// const Listing = require("../modals/listing.js");
const Review = require("./modals/reviewModal");

module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectUrl = req.originalUrl;
    res.status(401).json({ message: "Unauthorized", redirectUrl: res.locals.redirectUrl || "url" });
};
module.exports.isAuther = async(req,res,next)=>{
    let { Rid }=req.params;
    let review = await Review.findById(Rid);
    if (!req.user._id.equals(review.author._id)) {
        return res.status(402).json({msg:"not an author"})
    }
    next();
}
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
