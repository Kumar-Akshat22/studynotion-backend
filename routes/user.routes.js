import { Router } from "express";
import * as authControllers from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/login", authControllers.userLoginController);

router.post("/signup", authControllers.userSignUpController);

router.post("/sendotp", authControllers.sendOTPController);

router.post("/changepassword", authUser , authControllers.changePasswordController);



export default router;