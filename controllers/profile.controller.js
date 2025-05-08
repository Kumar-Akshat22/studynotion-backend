import * as profileServices from "../services/profile.service.js";

export const  updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedProfileDetails = await profileServices.updateProfile(
      req.body,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedProfileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in updating Profile",
      error: error.message,
    });
  }
};

export const deleteProfileController = async (req, res) => {
  // You have to make the delete controller in a different way
  // You have to schedule the deletion of the profile after 2 days

  try {
    // Get the profile ID
    const userId = req.user.id;
    const response = await profileServices.deleteProfile(userId);

    res.status(200).json({
      success: true,
      message: response.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in deleting the User Profile",
      error: error.message,
    });
  }
};

export const getUserDetailsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const userDetails = await profileServices.getUserDetails(userId);

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User details",
      userDetails,
    });
  }
};

export const getEnrolledCoursesController = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrolledCoursesData = await profileServices.getEnrolledCourses(userId);

    return res.status(200).json({
      success: true,
      message: "Fetched the user details",
      data: enrolledCoursesData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occured while fetching the enrolled courses of a user",
      error: error.message,
    });
  }
};

export const updateDisplayPictureController = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id;
    console.log("Profile Picture: ", file);
    const profilePicResponse = await profileServices.updateDisplayPicture(
      file.path,
      userId
    );

    res.status(200).send({
        success: true,
        message: `Image Updated successfully`,
        data: profilePicResponse,
      })
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Error occured in updating profile picture',
        error: error.message,
      })
  }
};
