import User from "../models/user.model.js"
import mailSender from "../utils/mailSender.js";

export const resetPasswordToken = async ({email}) => {
    

    const fetchedUserFromDb = await User.findOne({email});

    if(!fetchedUserFromDb){

        throw new Error("Your Email is not registered");
    }

    const token = crypto.randomUUID()

    const updatedUser = await User.findOneAndUpdate(
        {email: email}, 
        {
            token: token,
            resetPasswordExpires: Date.now() + 5*60*1000

        },
        {new: true}
    );

    const resetPasswordLink = `http://localhost:5173/reset-password/${token}`

    await mailSender(email , 
                    "Password Reset | Studynotion",
                    `Password Reset Link: ${resetPasswordLink}. Please click this url to reset your password.`
    )

    return updatedUser;
}

export const resetPassword = async ({newPassword , confirmNewPassword , token}) => {
    

    if(!newPassword || !confirmNewPassword){

        throw new Error("Please enter the password details");

    }

    if(newPassword !== confirmNewPassword){

        throw new Error("Passwords do not match");

    }

    const userDetails = await User.findOne({token : token});

    if(!userDetails){

        throw new Error("Invalid Token");
    }

    if(userDetails.resetPasswordExpires < Date.now()){

        throw new Error("Token is expired");
    }

    const hashedPassword = await User.hashPassword(newPassword);

    const updatedUser = await User.findOneAndUpdate(
        {token: token},
        {password: hashedPassword},
        {new : true}
    )

    return updatedUser;
}