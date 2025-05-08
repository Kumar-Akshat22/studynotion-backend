import { Router } from 'express';
import * as courseControllers from '../controllers/course.controller.js';
import * as sectionControllers from '../controllers/section.controller.js';
import * as subSectionControllers from '../controllers/subSection.controller.js';
import * as categoryControllers from '../controllers/category.controller.js';
import * as ratingAndReviewsControllers from '../controllers/ratingAndReview.controller.js';

import { authUser , isStudent , isAdmin , isInstructor } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multerConfig.js';

const router = Router();

// COURSE ROUTES
router.post('/createCourse' , authUser , isInstructor , upload.single("file") , courseControllers.createCourseController);

router.post('/addSection' , authUser , isInstructor , sectionControllers.createSectionController);

router.post('/updateSection' , authUser , isInstructor , sectionControllers.updateSectionController);

router.post('/deleteSection' , authUser , isInstructor , sectionControllers.deleteSectionController);


router.post('/addSubSection' , authUser , isInstructor , upload.single('file') , subSectionControllers.createSubSectionController);

router.post('/updateSubSection' , authUser , isInstructor , upload.single("file") , subSectionControllers.updateSubSectionController);

router.post('/deleteSubSection' , authUser , isInstructor , subSectionControllers.deleteSubSectionController);

router.get('/getAllCourses' , courseControllers.showAllCoursesController);

router.post('/getCourseDetails' , courseControllers.getCourseDetailsController);

router.post('/editCourse' , authUser , isInstructor , upload.single("file") , courseControllers.editCourseController);

router.get("/getInstructorCourses" , authUser , isInstructor , courseControllers.getInstructorCoursesController)

router.post("/getFullCourseDetails" , authUser , courseControllers.getFullCourseDetailsController)

router.delete("/deleteCourse" , courseControllers.deleteCourseController)

router.post("/updateCourseProgress" , authUser , isStudent , courseControllers.updateCourseProgressController)

// CATEGORY ROUTES
router.post("/createCategory" , authUser , isAdmin , categoryControllers.createCategoryController);

router.get("/showAllCategories" , categoryControllers.getAllCategoriesController);

router.post('/getCategoryPageDetails' , categoryControllers.getParticularCategoryPageDetailsController)

// Rating and Review ROUTES
router.post("/createRating", authUser, isStudent, ratingAndReviewsControllers.createRatingController)

router.post("/updateRating", authUser, isStudent, ratingAndReviewsControllers.updateRatingController)

router.get("/getAverageRating", ratingAndReviewsControllers.getAverageRatingController);

router.get('/getReviews' , ratingAndReviewsControllers.getAllRatingAndReviewsController);


export default router;
