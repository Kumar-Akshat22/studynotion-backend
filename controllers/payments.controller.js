import course from "../models/course.model.js";
import User from "../models/user.model.js";
import mailSender from "../utils/mailSender.js";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import * as paymentsServices from "../services/payments.service.js";
import {createHmac} from "crypto";

// Initiate the Order for the current course
export const capturePaymentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courses } = req.body;

    const { paymentResponse, orderId } = await paymentsServices.capturePayment(
      courses,
      userId
    );

    res.status(200).json({
      success: true,
      paymentResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occured in creating order",
      error: error.message,
    });
  }
};

// This controller will be executed when the Razorpay webhook will hit our backend route
export const verifyPaymentSignatureController = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id


  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment failed",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = 
    createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Enroll the student in all the courses
    await enrollStudents(courses , userId , res)
    return res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  }

  return req.status(400).json({
    success: false,
    message: "Payment Failed",
  });
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide data for courses and userId",
    });
  }

  for (const courseId of courses) {
    try {
      const updatedCourseDetails = await course.findByIdAndUpdate(
        courseId,
        {
          $push: {
            studentsEnrolled: userId,
          },
        },
        { new: true }
      );

      if (!updatedCourseDetails) {
        return res.status(500).json({
          success: false,
          message: "Course not found",
        });
      }

      // Add the course to the User Schema
      const updatedStudentDetails = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
          },
        },
        { new: true }
      );

      const emailResponse = await mailSender(
        updatedStudentDetails.email,
        `Successfully Enrolled into ${updatedCourseDetails.courseName}`,
        courseEnrollmentEmail(
          updatedCourseDetails.courseName,
          `${updatedStudentDetails.firstName} ${updatedStudentDetails.lastName}`
        )
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const sendPaymentSuccessEmailController = async (req , res) => {

    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    try {
        
        const sendPaymentSuccessEmailResponse = await paymentsServices.sendPaymentSuccessEmail(orderId , paymentId , amount , userId);

        res.status(200).json({

          success: true,
          message: "Mail sent successfully"
        })


    } catch (error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
    
}
