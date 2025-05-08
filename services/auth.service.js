import OTP from "../models/OTP.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import otpGenerator from "otp-generator";

// Send OTP mail to the user
export const createOTPAndSendEmail = async ({ email }) => {
  const isUserPresent = await User.findOne({ email });

  // User already has an account
  if (isUserPresent) {
    return;
  }

  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // Check uniqueness of the OTP
  const isOTPAlreadyPresent = await OTP.findOne({ otp: otp });

  const otpPayload = { email, otp };
  const createdOTP = await OTP.create(otpPayload);

  return createdOTP;
};

// Create User => Signup
export const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  accountType,
  contactNumber,
  otp,
}) => {
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !otp
  ) {
    throw new Error("All fields are required");
  }

  if (password !== confirmPassword) {
    throw new Error("Password and Confirm Password do not match. Please try again.");
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Validate the OTP
  const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
  console.log(recentOTP);

  if (!recentOTP) {
    throw new Error("OTP not found");
  }

  if (recentOTP.otp.trim() !== otp.trim()) {
    throw new Error("OTP not matching");
  }

  // Hash the password
  const hashedPassword = await User.hashPassword(password);

  const profileDetails = await Profile.create({
    gender: null,
    dateOfBirth: null,
    about: null,
    contactNumber: null,
  });

  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    contactNumber,
    password: hashedPassword,
    accountType,
    additionalDetails: profileDetails._id,
    image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
  });

  return createdUser;
};

// Login User
export const loginUser = async ({email , password}) => {

    try {
        
        if(!email || !password){

            throw new Error("All fields required");
        }

        const fetchedUserFromDb = await User.findOne({email}).select("+password");
        if(!fetchedUserFromDb){

            throw new Error("User does not exist. Please Signup first");
        }
        
        const isPasswordMatching = await fetchedUserFromDb.isValidPassword(password);

        if(!isPasswordMatching){

            throw new Error("Invalid Password");
        }

        const token = await fetchedUserFromDb.generateJWT()
        return {
            token,  
            user:{

                id: fetchedUserFromDb._id,
                email: fetchedUserFromDb.email,
                firstName: fetchedUserFromDb.firstName,
                lastName: fetchedUserFromDb.lastName,
                accountType: fetchedUserFromDb.accountType,
                image: fetchedUserFromDb.image
            }
        }

    } catch (error) {
        
        console.log("Error occured in the login user service under auth services" , error.message);
        throw error
    }
};

export const changePassword = async ({ newPassword , confirmNewPassword} , email) => {
    
    if(!newPassword || !confirmNewPassword){

      throw new Error("Passwords are required");
    }
    
    if(newPassword !== confirmNewPassword){

      throw new Error("The password and confirm password does not match");
      
    }
    
    const userFound = await User.findOne({email});
    
    if(!userFound){
      
      throw new Error("User not found");

    }

    const newHashedPassword = await User.hashPassword(newPassword);

    const updatedUser = await User.findOneAndUpdate(
      {email} , 
      {password: newHashedPassword},
      {new:true}
    );

    return updatedUser

}
