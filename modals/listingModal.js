const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("../modals/reviewModal")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            set: (v) =>
                v === "" ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" :
                    v,
        }
    },

    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    review:
        [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
});
// delete middleware => when listing delete , all reviews should be deleted

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } })
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;