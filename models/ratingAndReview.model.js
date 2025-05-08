import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({

    user:{

        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    rating: {

        type: Number,
        required : true,

    },

    review: {

        type: String,
        required: true,
    },

    course: {

        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "course",
        index: true,
    }
} , {timestamps: true})

const ratingAndReviews = mongoose.model("ratingAndReviews" , ratingAndReviewSchema);

export default ratingAndReviews;