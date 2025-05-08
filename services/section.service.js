import course from '../models/course.model.js';
import section from '../models/section.model.js'
import subSection from '../models/subSection.model.js';

export const createSection = async ({sectionName , courseId}) => {
    

    if(!sectionName || !courseId){

        throw new Error("All fields are required");
    }

    const newSection = await section.create({sectionName});

    const updatedCourse = await course.findByIdAndUpdate(courseId , {
        $push: {

            courseContent: newSection._id
        }
    }, {
        new: true
    })
    .populate({
        path: "courseContent",
        populate: {
            path: "subSection"
        }
    })
    .exec();

    return updatedCourse;
}

export const updateSection = async ({sectionName , sectionId , courseId}) => {
    
    if(!sectionName || !sectionId){

        throw new Error("All fields are required");
    }

    const updatedSection = await section.findByIdAndUpdate(sectionId , {
        
        sectionName
    } , {new: true});
    
    const updatedCourse = await course.findById(courseId).populate({
        path: "courseContent",
        populate: {
            path: "subSection"
        }
    }).exec()
    return {updatedSection , updatedCourse};

}

export const deleteSection = async (sectionId , courseId) => {
    
    await course.findByIdAndUpdate(courseId , {
        $pull: {
            courseContent: sectionId
        }
    });

    const sectionToDelete = await section.findById(sectionId);
    if(!sectionToDelete) {
        return res.status(404).json({
            success:false,
            message:"Section not Found",
        })
    }

    await subSection.deleteMany({_id: {$in: section.subSection}});

    await section.findByIdAndDelete(sectionId);

    const updatedCourse = await course.findById(courseId).populate({

        path: "courseContent",
        populate: {
            path: "subSection"
        }
    }).exec();

    return updatedCourse;
}