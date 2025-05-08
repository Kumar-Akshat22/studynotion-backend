import mongoose from "mongoose";
import course from "../models/course.model.js";
import { instance } from "../server.js";
import User from "../models/user.model.js";
import mailSender from "../utils/mailSender.js";
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessEmail.js";


export const capturePayment = async (courses , userId) => {
    
    if(courses.length === 0){

        throw new Error("Please provide course details");
    }

    let totalAmount = 0;
    for(const courseId of courses){

        let courseDetails;
        try {
            
            courseDetails = await course.findById(courseId).select("courseName price studentsEnrolled");
            if(!courseDetails){

                throw new Error(`Course details for Course Id ${courseDetails._id}`)
            }

            const uid = new mongoose.Types.ObjectId(userId);

            if(courseDetails.studentsEnrolled.includes(uid)){

                throw new Error(`You have already bought the course. Go to your dashboard`);
            }

            totalAmount+=courseDetails.price;

        } catch (error) {
            
            throw error;
        }
    }

    const options = {

        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString()
    }

    try {
        
        const paymentResponse = await instance.orders.create(options);

        return {

            paymentResponse,
            orderId: paymentResponse.id,

        }

    } catch (error) {
        console.log("Error: " , error.message);
        return;
    }
}


export const sendPaymentSuccessEmail = async (orderId , paymentId , amount , userId) => {


    if(!orderId || !paymentId || !amount || !userId) {
        throw new Error("Please provide all the fields");
    }

    const enrolledStudentDetails = await User.findById(userId).select("firstName lastName email");

    const sendPaymentSuccessEmailResponse = await mailSender(enrolledStudentDetails.email , `Payment Recieved`, paymentSuccessEmail(`${enrolledStudentDetails.firstName} ${enrolledStudentDetails.lastName}` , amount/100 , orderId , paymentId));

    return sendPaymentSuccessEmailResponse;
}