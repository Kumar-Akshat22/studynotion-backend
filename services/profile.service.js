import fs from "fs"
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryUploader.js";
import { enrichCourseData } from "../utils/enrichedCourseData.js";
import courseProgress from "../models/courseProgress.model.js";

export const updateProfile = async ({firstName , lastName ,dateOfBirth="" , about="" , contactNumber, gender} , userId) => {
    

    if(!firstName || !lastName || !contactNumber || !gender || !userId){

        throw new Error("All fields are required");
    }

    const userDetails = await User.findById(userId);
    console.log("User Details: " , userDetails);

    const profileId = userDetails.additionalDetails;

    const profileDetails = await Profile.findById(profileId);


    profileDetails.gender = gender;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    const updatedUserDetails = await User.findById(userId).populate("additionalDetails");
    console.log("Updated User Details: " , updatedUserDetails);

    return updatedUserDetails;
    

}

export const deleteProfile = async (userId) => {

    const userDetails = await User.findById(userId);
    
    if(!userDetails){

        throw new Error("User does not exist");
    }

    await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});

    await User.findByIdAndDelete({_id: userId});

    // TODO: Unenroll the student form all the enrolled courses

    return {message: "User deleted successfully"};

}

export const getUserDetails = async (userId) => {
    

    if(!userId){

        throw new Error("Token invalid");
    }
    
    const userDetails = await User.findById(userId).populate("additionalDetails").exec();
    
    if(!userDetails){
        
        throw new Error("User not found");
        
    }

    return userDetails;
}

export const getEnrolledCourses = async (userId) => {

    const userDetails = await User.findById(userId).populate({
        path: "courses",
        populate: {
            path: "courseContent",
            populate:{
                path: "subSection"
            }
        }
    })

    if(!userDetails){

        throw new Error(`Could not find user details with userId ${userId}`)
    }
    
    const enrolledCoursesData = [];
    
    for(const course of userDetails.courses){
        
        const totalVideos = course.courseContent.reduce((acc , section)=>{
            return acc+section.subSection.length;
        } , 0);

        const courseDuration = enrichCourseData(course);

        const courseProgressDetails = await courseProgress.findOne({
            courseID: course._id,
            userID: userId
        });

        const progressPercentage = courseProgressDetails ? (courseProgressDetails.completedVideos.length / totalVideos )* 100 : 0;

        enrolledCoursesData.push({
            courseData:course,
            totalDuration: courseDuration,
            progressPercentage: Math.round(progressPercentage),
        })
    }

    return enrolledCoursesData;

}

export const updateDisplayPicture = async (prfoilePicturePath , userId) => {
    
    const userDetails = await User.findById(userId);

    if (!userDetails) {
        throw new Error("User not found");
    }

    const cloudinaryResponse = await uploadFileToCloudinary(prfoilePicturePath , process.env.FOLDER_NAME , 1000 , 1000);

    // Delete temp file
    fs.unlinkSync(prfoilePicturePath);

    const updatedUserDetails = await User.findByIdAndUpdate(
        {_id: userId},
        {
            image: cloudinaryResponse.secure_url
        },
        {new: true}
    );

    console.log("Updated user Details: " , updatedUserDetails);

    return updatedUserDetails;
}