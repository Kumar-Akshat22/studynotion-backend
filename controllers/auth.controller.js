import * as authService from '../services/auth.service.js';
import mailSender from '../utils/mailSender.js';
import { passwordUpdated } from '../mail/templates/passwordUpdate.js';

export const sendOTPController = async (req , res) => {
    
    try {
        
        const OTPResponse = await authService.createOTPAndSendEmail(req.body);

        return res.status(200).json({

            success:true,
            message: "OTP email sent successfully",
            OTPResponse,
        })

    } catch (error) {
        
        return res.status(500).json({

            success: false,
            error: error.message
        })
    }
}

export const userSignUpController = async (req , res) => {
    
    try {

        const createdUser = await authService.createUser(req.body);



        res.status(200).json({

            success: true,
            message: "User is registered successfully",
            createdUser
        })
    } catch (error) {
        return res.status(500).json({

            success: false,
            message: "Error in registering user",
            error: error.message
        })
    }
}

export const userLoginController = async(req , res) => {

    try {
        
        const {token , user} = await authService.loginUser(req.body);

        const options = {

            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly: true,

        }
        
        res.cookie("token" , token , options).status(200).json({

            success:true,
            token,
            user,
            message: "User Logged In Successfully",
        })


    } catch (error) {
        return res.status(500).json({

            success:false,
            message: "Error occured in the Login Controller",
            error: error.message
        })
    }
}

export const changePasswordController = async (req , res) => {
    try {
        
        const email = req.user.email;
        const updatedUser = await authService.changePassword(req.body , email);

        try {

            const emailResponse = await mailSender(email , "Password Reset Successful | StudyNotion" , passwordUpdated(email ,`Password updated successfully for ${updatedUser.firstName} ${updatedUser.lastName}`))
            
            console.log("Email sent successfully:", emailResponse.response);

        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
        }

        res.status(200).json({

            success: true,
            message: "Password Changed successfully"
        })
    


    } catch (error) {
        

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
}


