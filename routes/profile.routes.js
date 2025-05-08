import { Router } from "express";
import * as profileControllers from "../controllers/profile.controller.js";
import * as resetPasswordControllers from "../controllers/resetPassword.controller.js";

import { authUser } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multerConfig.js";

const router = Router();

router.delete("/deleteProfile", authUser , profileControllers.deleteProfileController);

router.put(
  "/updateProfile",
  authUser,
  profileControllers.updateProfileController
);

router.post(
  "/reset-password-token",
  resetPasswordControllers.resetPasswordTokenController
);

router.post("/reset-password", resetPasswordControllers.resetPasswordController);

router.get(
  "/getUserDetails",
  authUser,
  profileControllers.getUserDetailsController
);

router.get(
  "/getEnrolledCourses",
  authUser,
  profileControllers.getEnrolledCoursesController
);

router.put(
  "/updateDisplayPicture",
  authUser,
  upload.single("file"),
  profileControllers.updateDisplayPictureController
);


export default router;