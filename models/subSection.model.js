import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema({

    title: {

        type: String,
        trim: true,
    },

    timeDuration: {

        type: String,

    },
    
    description: {

        type: String,

    },

    videoURL: {

        type: String,

    }


} , {timestamps: true})

const subSection = mongoose.model("subSection" , subSectionSchema);
export default subSection;