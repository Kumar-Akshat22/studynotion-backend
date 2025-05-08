import fs from "fs"
import { uploadFileToCloudinary } from "../utils/cloudinaryUploader.js";
import subSection from "../models/subSection.model.js";
import section from "../models/section.model.js";

export const createSubSection = async ({sectionId , title , description} , lectureVideoPath) => {
    if(!sectionId || !title || !description){

        throw new Error("All fields are required");
    }

    const uploadResponse = await uploadFileToCloudinary(lectureVideoPath , process.env.FOLDER_NAME);

    fs.unlinkSync(lectureVideoPath);

    const createdLecture = await subSection.create({

        title: title,
        timeDuration: `${uploadResponse.duration}`,
        description: description,
        videoURL: uploadResponse.secure_url,
    });

    await section.findByIdAndUpdate({_id: sectionId}, {$push: {subSection: createdLecture._id}} , {new: true});

    const updatedSection = await section.findById(sectionId).populate("subSection");


    return {updatedSection , createdLecture};
}

// Update Sub Section
export const updateSubSection = async ({sectionId , subSectionId, title, description} , lectureVideoPath) => {
    
    const subSectionDetails = await subSection.findById(subSectionId);

    if (!subSectionDetails) {
        
        throw new Error("SubSection not found")
        
    }

    if (title !== undefined) {
        subSectionDetails.title = title
    }
  
    if (description !== undefined) {
        subSectionDetails.description = description
    }

    if(lectureVideoPath){

        const uploadDetails = await uploadFileToCloudinary(
            lectureVideoPath,
            process.env.FOLDER_NAME
        );

        try {
            fs.unlinkSync(lectureVideoPath);
        } catch (err) {
            console.error("Failed to delete local file:", err);
        }

        subSectionDetails.videoURL = uploadDetails.secure_url;

        subSectionDetails.timeDuration = `${uploadDetails.duration}`
    }

    await subSectionDetails.save();

    const updatedSection = await section.findById(sectionId).populate("subSection");

    return updatedSection;
}

// Delete Sub Section
export const deleteSubSection = async ({subSectionId , sectionId}) => {
    
    const updatedSection = await section.findByIdAndUpdate(
        {_id: sectionId},
        {
            $pull: {
                subSection: subSectionId
            }
        },
        {new:true}
    )

    const subSectionDeleted = await subSection.findByIdAndDelete({_id: subSectionId});

    if (!subSectionDeleted) {
        throw new Error("SubSection not found"); 
      }

      return updatedSection;
}