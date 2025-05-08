import { Router } from "express";
import { authUser, isStudent } from "../middlewares/auth.middleware.js";
import * as paymentsControllers from '../controllers/payments.controller.js'

const router = Router();

router.post('/capturePayment' , authUser , isStudent , paymentsControllers.capturePaymentController);

router.post('/verifyPayment' , authUser , isStudent , paymentsControllers.verifyPaymentSignatureController);

router.post("/sendPaymentSuccessEmail", authUser, isStudent, paymentsControllers.sendPaymentSuccessEmailController);

export default router