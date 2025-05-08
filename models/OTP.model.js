import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";
import {otpTemplate} from '../mail/templates/emailVerificationTemplate.js'

const OTPSchema = new mongoose.Schema({

    email: {

        type: String,
        required: true,
    },

    otp: {

        type: String,
        required: true,

    },

    createdAt: {

        type: Date,
        default: Date.now,
        expires: 5*60, // The document will be automatically deleted after 5 minutes of its creation time

    }
});

async function sendVerificationEmail(email , otp) {
    
    try {

        const response = await mailSender(email , "Verification email from StudyNotion" , otpTemplate(otp));

        console.log("Email sent successfully: ", response);



    } catch (error) {
        
        console.log('Error occured while sending Mail',error);
        throw error;
    }
}

OTPSchema.pre('save' , async function (next) {
    
    if (this.isNew) {
        try {
            await sendVerificationEmail(this.email, this.otp);
            next();
        } catch (error) {
            next(error); // pass error to Mongoose
        }
    } else {
        next();
    }
})


const OTP = mongoose.model("OTP" , OTPSchema);
export default OTP;