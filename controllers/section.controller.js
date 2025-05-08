import * as sectionServices from "../services/section.service.js";

export const createSectionController = async (req, res) => {
  try {
    const updatedCourse = await sectionServices.createSection(req.body);

    res.status(200).json({
      success: true,
      message: "Section added successfully",
      updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occured in creating section",
      error: error.message,
    });
  }
};

export const updateSectionController = async (req, res) => {
  try {
    const {updatedCourse} = await sectionServices.updateSection(req.body);

    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data:updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occured in updating section",
      error: error.message,
    });
  }
};

export const deleteSectionController = async (req, res) => {
  try {
    const {sectionId, courseId} = req.body;
    const updatedCourse = await sectionServices.deleteSection(sectionId , courseId);
    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: updatedCourse
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occured in deleting section",
      error: error.message,
    });
  }
};
