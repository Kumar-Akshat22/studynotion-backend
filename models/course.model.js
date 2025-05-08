import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },

  courseDescription: {
    type: String,
    required: true,
    trim: true,
  },

  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  whatYouWillLearn: {
    type: String,
  },

  price: {
    type: Number,
  },

  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
    },
  ],

  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ratingAndReviews",
    },
  ],

  thumbnail: {
    type: String,
  },

  tag: {
    type: [String],
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },

  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  instructions: {
    type: [String],
  },

  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
} , {timestamps: true});

const course = mongoose.model("course", courseSchema);
export default course;
