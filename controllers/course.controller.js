import User from "../models/user.model.js";
import * as courseServices from "../services/course.service.js";

export const createCourseController = async (req, res) => {
  try {
    const file = req.file;

    const instructorID = req.user.id;
    const instructorDetails = await User.findById(instructorID, {
      accountType: "Instructor",
    });
    console.log("Instructor Details: ", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }
    const { newCourse } = await courseServices.createCourse(
      req.body,
      file.path,
      instructorDetails
    );

    res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occured in creating Course",
      error: error.message,
    });
  }
};

export const showAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseServices.getAllCourses();

    res.status(200).json({
      success: true,
      message: "Fetched all the courses details",
      data: allCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching the all courses data",
    });
  }
};

export const getCourseDetailsController = async (req, res) => {
  try {
    const {courseId} = req.body;
    const enrichCourseData = await courseServices.getCourseDetails(courseId);

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: enrichCourseData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching the course details",
      error: error.message,
    });
  }
};

export const editCourseController = async (req, res) => {
  try {
    const file = req.file;
    const filePath = file ? file.path : null;
    const { courseId } = req.body;
    const updates = req.body;
    const updatedCourse = await courseServices.editCourse(
      courseId,
      updates,
      filePath
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getInstructorCoursesController = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const instructorCourses = await courseServices.getInstructorCourses(
      instructorId
    );
    res.status(200).json({
      success: true,
      message: "Successfully fetched the Instructor courses",
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

export const getFullCourseDetailsController = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    console.log("Course ID: " , courseId);

    const { courseDetails, totalDuration, completedVideos } =
      await courseServices.getFullCourseDetails(courseId, userId);

    res.status(200).json({
      success: true,
      message: "Full Course details fetched",
      data: {
        courseDetails,
        totalDuration,
        completedVideos
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occured in fetching the course details",
      error: error.message,
    });
  }
};

export const deleteCourseController = async (req, res) => {
  try {
    const {courseId} = req.body;
    const message = await courseServices.deleteCourse(courseId);
    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in deleting course",
      error: error.message,
    });
  }
};

export const updateCourseProgressController = async (req , res) => {

  const {courseId , subSectionId} = req.body;
  const userId = req.user.id;
  try {
    
    const courseProgressDetails = await courseServices.updateCourseProgress(courseId , subSectionId , userId);
    return res.status(200).json({
      success: true,
      message: "Lecture marked as completed",
      data: courseProgressDetails,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course progress",
    });
  }
  
}
