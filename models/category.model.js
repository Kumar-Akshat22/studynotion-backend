import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({

    name: 
    {
        type: String,
        required: true,

    },

    description: {

        type: String,

    },

    courses: [
        {

            type: mongoose.Schema.Types.ObjectId,
            ref: "course"
        }
    ]
    
} , {timestamps: true});

const category = mongoose.model("category" , categorySchema);
export default category;