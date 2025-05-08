import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({

    firstName: {

        type: String,
        required: true,
        trim:true
    },

    lastName: {

        type: String,
        required: true,
        trim:true
    },

    email:{

        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, "Email must be at least 6 characters long"],
        maxLength: [50, "Email must not be longer than 50 characters"],
    },

    password:{

        type: String,
        required: true,
        trim:true,
        select: false,
    },

    accountType: {

        type: String,
        enum:["Admin" , "Student" , "Instructor"],
        required: true

    },

    active: {

        type: Boolean,
        default: true
    },

    approved: {

        type: Boolean,
        default: true,

    },

    additionalDetails:{

        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile"
    },

    courses:[

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course"
        }
    ],

    image: {

        type: String,
        required: true,
    },

    token: {

        type: String,
        
    },

    resetPasswordExpires: {

        type: Date, 
    },

    courseProgress:[
        {

        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress" 
    }
]


} , {timestamps: true});

userSchema.statics.hashPassword = async function(password){

    return await bcrypt.hash(password , 10);
}

userSchema.methods.isValidPassword = async function (password) {
    
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateJWT = function(){

    return jwt.sign({
    
        email: this.email , 
        id: this._id , 
        role: this.accountType
    
    } , 
    
    process.env.JWT_SECRET , {

        expiresIn: "7h"
    });
}

const User = mongoose.model("User" , userSchema)

export default User;