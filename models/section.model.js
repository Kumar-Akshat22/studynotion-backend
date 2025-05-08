import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({

    sectionName: {

        type: String,

    },

    subSection:[

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subSection",
            required: true,
        }
    ]
} , {timestamps: true})

const section = mongoose.model("section" , sectionSchema);
export default section;