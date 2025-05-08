import category from "../models/category.model.js";
import course from "../models/course.model.js";
import { calculateCourseStats } from "../utils/courseStats.js";

export const createCategory = async ({ name, description }) => {
  if (!name || !description) {
    throw new Error("All fields are required");
  }

  const categoryDetails = await category.create({
    name: name,
    description: description,
  });

  return categoryDetails;
};

export const getAllCategories = async () => {
  const allCategories = await category.find(
    {},
    { name: true, description: true }
  );

  return allCategories;
};

export const getParticularCategoryPageDetails = async (categoryId) => {
  // Step 1: Fetch selected category with its published courses and their reviews
  const currentCategoryDetails = await category
    .findById(categoryId)
    .populate({
      path: "courses",
      match: { status: "Published" },
      select:
        "courseName courseDescription instructor ratingAndReviews thumbnail status price",
      populate: [
        {
          path: "instructor",
          select: "firstName lastName image",
        },

        {
          path: "ratingAndReviews",
          select: "rating",
        },
        {
          path: "studentsEnrolled", // we only need count, so just populate to get array
          select: "_id", // smallest possible
        },
      ],
    })
    .lean()
    .exec();

  if (!currentCategoryDetails || currentCategoryDetails.courses.length === 0) {
    throw new Error("No Courses found for the selected Category");
  }

  const currentCategoryEnrichedCoursesData = calculateCourseStats(
    currentCategoryDetails.courses
  );

  // Step 2: Pick a different category randomly for 'Frequently Bought Together'
  const otherCategories = await category.find({
    _id: { $ne: categoryId },
  });

  const randomCategory =
    otherCategories[Math.floor(Math.random() * otherCategories.length)];

  const randomCategoryDetails = await category
    .findById(randomCategory._id)
    .populate({
      path: "courses",
      match: { status: "Published" },
      select:
        "courseName courseDescription instructor ratingAndReviews thumbnail status price",
      populate: [
        {
          path: "instructor",
          select: "firstName lastName image",
        },

        {
          path: "ratingAndReviews",
          select: "rating",
        },
        {
          path: "studentsEnrolled", // we only need count, so just populate to get array
          select: "_id", // smallest possible
        },
      ],
    })
    .lean()
    .exec();
  const randomCategoryCoursesEnrichedData = calculateCourseStats(
    randomCategoryDetails.courses
  );

  // Get the Top Popular courses
  // Get all published courses to calculate top courses
  const allCourses = await course
    .find({ status: "Published" })
    .populate([
      {
        path: "ratingAndReviews",
        select: "rating",
      },
      {
        path: "instructor",
        select: "firstName lastName image",
      },
      {
        path: "studentsEnrolled", // we only need count, so just populate to get array
        select: "_id", // smallest possible
      },
    ])
    .lean()
    .exec();

  const allCoursesEnrichedData = calculateCourseStats(allCourses);
  const topCourses = allCoursesEnrichedData
    .sort((a, b) => {
      if (b.enrollmentCount !== a.enrollmentCount) {
        return b.enrollmentCount - a.enrollmentCount;
      }

      return b.avgRating - a.avgRating;
    })
    
  return {

    selectedCategoryDetails: {
      name: currentCategoryDetails.name,
      description: currentCategoryDetails.description,
      courses: currentCategoryEnrichedCoursesData
    },

    frequentlyBoughtTogether: {

      name: randomCategoryDetails.name,
      courses: randomCategoryCoursesEnrichedData,
    },

    topCourses

  };
};
