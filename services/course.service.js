import fs from "fs";
import course from "../models/course.model.js";
import User from "../models/user.model.js";
import category from "../models/category.model.js";
import section from "../models/section.model.js";
import subSection from "../models/subSection.model.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryUploader.js";
import { secondsToDuration } from "../utils/secondsToDuration.js";
import ratingAndReviews from "../models/ratingAndReview.model.js";
import courseProgress from "../models/courseProgress.model.js";
import { calculateStatsForACourse } from "../utils/courseStats.js";

export const createCourse = async (
  {
    courseName,
    courseDescription,
    whatYouWillLearn,
    price,
    CategoryId,
    Tag,
    status,
    instructions: _instructions,
  },
  thumbnailPath,
  instructorDetails
) => {
  if (
    !courseName ||
    !courseDescription ||
    !courseDescription ||
    !whatYouWillLearn ||
    !price ||
    !CategoryId ||
    !thumbnailPath
  ) {
    throw new Error("All fields including thumbnail are required");
  }

  if (!status) {
    status = "Draft";
  }

  const categoryDetails = await category.findById(CategoryId);
  if (!categoryDetails) {
    throw new Error("Category details not found");
  }

  const cloudinaryResponse = await uploadFileToCloudinary(
    thumbnailPath,
    process.env.FOLDER_NAME
  );

  fs.unlinkSync(thumbnailPath);

  // Convert the tag and instructions from stringified Array to Array
  const tag = JSON.parse(Tag);
  const instructions = JSON.parse(_instructions);

  console.log("tag", tag);
  console.log("instructions", instructions);

  const newCourse = await course.create({
    courseName,
    courseDescription,
    instructor: instructorDetails._id,
    whatYouWillLearn: whatYouWillLearn,
    price: price,
    tag,
    category: categoryDetails._id,
    thumbnail: cloudinaryResponse.secure_url,
    status: status,
    instructions,
  });

  const updatedUser = await User.findByIdAndUpdate(
    { _id: instructorDetails._id },
    {
      $push: {
        courses: newCourse._id,
      },
    },
    { new: true }
  );

  const updatedCategoryDetails = await category.findByIdAndUpdate(
    { _id: CategoryId },
    {
      $push: {
        courses: newCourse._id,
      },
    },
    { new: true }
  );

  return { newCourse, updatedUser, updatedCategoryDetails };
};

export const getAllCourses = async () => {
  const allCourses = await course
    .find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
    .populate("instructor")
    .exec();

  return allCourses;
};

export const getCourseDetails = async (courseId) => {
  const courseDetails = await course
    .findOne({ _id: courseId })
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .lean()
    .exec();

  if (!courseDetails) {
    throw new Error("Course details not found, Please try again");
  }

  const enrichedCourseData = await calculateStatsForACourse(courseDetails);

  return enrichedCourseData;
};

export const editCourse = async (courseId, updates, filePath) => {
  console.log("Updates:", updates);
  const courseDetails = await course.findById(courseId);

  if (!courseDetails) {
    throw new Error("Course not found");
  }

  if (filePath) {
    console.log("thumbnail update");
    const thumbnailImage = await uploadFileToCloudinary(
      filePath,
      process.env.FOLDER_NAME
    );
    fs.unlinkSync(filePath);
    courseDetails.thumbnail = thumbnailImage.secure_url;
  }

  Object.keys(updates).forEach((key) => {
    if (key === "tag" || key === "instructions") {
      courseDetails[key] = JSON.parse(updates[key]);
    } else {
      courseDetails[key] = updates[key];
    }
  });

  await courseDetails.save();

  const updatedCourse = await course
    .findOne({ _id: courseId })
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();

  return updatedCourse;
};

export const getInstructorCourses = async (instructorId) => {
  const instructorCourses = await course
    .find({
      instructor: instructorId,
    })
    .sort({ createdAt: -1 });

  if (!instructorCourses) {
    throw new Error("No courses created by the instructor");
  }

  return instructorCourses;
};

export const getFullCourseDetails = async (courseId, userId) => {
  const courseData = await course
    .findOne({
      _id: courseId,
    })
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .lean()
    .exec();

  if (!courseData) {
    throw new Error(`Could not find course with id: ${courseId}`);
  }

  const courseProgressDetails = await courseProgress.findOne({
    userID: userId,
    courseID: courseId,
  });

  const courseDetails = calculateStatsForACourse(courseData);

  return {
    courseDetails,
    completedVideos: courseProgressDetails?.completedVideos
      ? courseProgressDetails?.completedVideos
      : [],
  };
};

export const deleteCourse = async (courseId) => {
  const courseDetails = await course.findById(courseId);
  if (!courseDetails) {
    throw new Error("Course not found");
  }

  // Unenroll students from the course
  const studentsEnrolled = courseDetails.studentsEnrolled;
  for (const studentId of studentsEnrolled) {
    await User.findByIdAndUpdate(studentId, {
      $pull: { courses: courseId },
    });
  }

  // Delete sections and sub-sections
  const courseSections = courseDetails.courseContent;
  for (const sectionId of courseSections) {
    const sectionDetails = await section.findById(sectionId);
    if (sectionDetails) {
      const subSections = sectionDetails.subSection;
      for (const subSectionId of subSections) {
        await subSection.findByIdAndDelete(subSectionId);
      }

      await section.findByIdAndDelete(sectionId);
    }
  }

  // Remove the course from instructors profile as well
  const instructorId = courseDetails.instructor;
  await User.findByIdAndUpdate(instructorId, {
    $pull: {
      courses: courseId,
    },
  });

  // Remove the course from the particular category as well
  const categoryId = courseDetails.category;
  await category.findByIdAndUpdate(categoryId, {
    $pull: {
      courses: courseId,
    },
  });

  // Remove the reating and reviews of the course
  const ratingAndReviewsDetails = courseDetails.ratingAndReviews;
  for (const ratingAndReviewId of ratingAndReviewsDetails) {
    await ratingAndReviews.findByIdAndDelete(ratingAndReviewId);
  }

  await course.findByIdAndDelete(courseId);

  return { success: true, message: "Course deleted successfully" };
};

export const updateCourseProgress = async (courseId, subSectionId, userId) => {
  let courseProgressDetails = await courseProgress.findOne({
    courseID: courseId,
    userId: userId,
  });

  if (!courseProgressDetails) {
    await courseProgress.create({
      courseID: courseId,
      userID: userId,
      completedVideos: [subSectionId],
    });
  } else {
    if (!courseProgressDetails.completedVideos.includes(subSectionId)) {
      courseProgressDetails.completedVideos.push(subSectionId);
      await courseProgress.save();
    }
  }

  return courseProgressDetails;
};
