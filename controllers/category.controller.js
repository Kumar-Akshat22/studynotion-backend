import * as categoryServices from "../services/category.service.js";

export const createCategoryController = async (req, res) => {
  try {
    const categoryDetails = await categoryServices.createCategory(req.body);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error occured in Creating category ${error.message}`,
    });
  }
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const allCategories = await categoryServices.getAllCategories();

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error occured in fetching Categories ${error.message}`,
    });
  }
};

export const getParticularCategoryPageDetailsController = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const { topCourses, frequentlyBoughtTogether, selectedCategoryDetails } =
      await categoryServices.getParticularCategoryPageDetails(categoryId);

    return res.status(200).json({
      success: true,
      data: {
        topCourses,
        frequentlyBoughtTogether,
        selectedCategoryDetails,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
