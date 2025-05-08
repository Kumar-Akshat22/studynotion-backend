import * as subSectionServices from '../services/subSection.service.js'

export const createSubSectionController = async (req , res) => {
    
    try {
        
        const file = req.file;
        const filePath = file ? file.path : null; 
        console.log("Lecture Video file: " , file);
        const {createdLecture , updatedSection} = await subSectionServices.createSubSection(req.body , filePath);

        res.status(200).json({

            success: true,
            message: "Lecture created successfully",
            data: updatedSection
        })

    } catch (error) {
        

        return res.status(500).json({

            success: false,
            message: "Error in creating Lecture",
            error: error.message
        })
    }
}

export const updateSubSectionController = async (req , res) => {
    

    try {
        
        const file = req.file;
        const filePath = file ? file.path : null; 
        const updatedSection = await subSectionServices.updateSubSection(req.body , filePath);

        return res.status(200).json({

            success: true,
            message: "Section updated successfully",
            data: updatedSection
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the sub section",
            error: error.message
        })
    }


}

export const deleteSubSectionController = async (req , res) => {

    try {
        
        const updatedSection = await subSectionServices.deleteSubSection(req.body);
        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
        })
    }

}