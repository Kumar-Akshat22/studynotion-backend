import * as resetPasswordServices from "../services/resetPassword.service.js";

export const resetPasswordTokenController = async (req, res) => {
  try {
    const updatedUser = await resetPasswordServices.resetPasswordToken(
      req.body
    );

    res.status(200).json({
      success: true,
      message:
        "Email sent successfully, please check your email and reset your password",
        
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message:
          "Something went wrong while reset password",
        error: error.message
      });
  }
};

export const resetPasswordController = async (req , res) => {
    
    
    try {
        
        const updatedUser = await resetPasswordServices.resetPassword(req.body)

        res.status(200).json({

            success: true,
            message: "Password reset Successfull",
            data:updatedUser
        })
    } catch (error) {
        return res.status(500).json({

            success: false,
            message: "Something went wrong in reset password",
            error: error.message
        })
    }
}
