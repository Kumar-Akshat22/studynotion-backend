import mongoose from 'mongoose';
import course from '../models/course.model.js'
import ratingAndReviews from '../models/ratingAndReview.model.js';

export const createRating = async(userId , courseId, rating, review)=>{


    const courseDetails = await course.findOne(
        {_id: courseId},
        {
            studentsEnrolled:{
                $elemMatch:{$eq: userId}
            }
        }
        
    )

    if(!courseDetails){

        throw new Error("Student is not enrolled in the course");
        
    }

    const alreadyReviewed = await ratingAndReviews.findOne({user: userId , course: courseId});

    if(alreadyReviewed){
        throw new Error("Student has already reviwed the course");

    }

    const ratingAndReview = await ratingAndReviews.create(
        {
            user: userId,
            course: courseId,
            rating: rating,
            review: review,
        }
    );

    const updatedCourseDetails = await course.findByIdAndUpdate(courseId , {
        $push:{
            ratingAndReviews:ratingAndReview._id
        }
    },
    {new: true}
    )

    return updatedCourseDetails;
}

export const updateRating = async(userId , courseId , rating , review)=>{

    if (!rating && !review) {
        
        throw new Error("Nothing to update. Provide rating or review.")
        
    }
    
    const courseDetails = await course.findById(courseId);
    
    if(!courseDetails){
        
        throw new Error("Course not found")

    }

    const existingReview = await ratingAndReviews.findOne({

        course:courseId,
        user: userId
    })

    if(!existingReview){
        
        throw new Error("Review does not exist. You can only update existing reviews.")
    }

    if(rating){

        existingReview.rating = rating
    }

    if(review){

        existingReview.review = review
    }

    existingReview.updatedAt = Date.now();

    await existingReview.save();

    return existingReview;
}

export const getAverageRating = async ({courseId}) => {
    

    const result = await ratingAndReviews.aggregate([
        {
            $match:{

                course: new mongoose.Types.ObjectId(courseId)
            }
        },
        {
            $group:{

                _id: null,
                averageRating: {$avg: "$rating"}
            }
        }
    ])

    if(result.length > 0){

        return {averageRating: result[0].averageRating};
    }

    return {averageRating: 0};

}

export const getAllRatingAndReviews = async () => {
    
    const allReviews = await ratingAndReviews.find({})
    .sort({rating: "desc"})
    .populate({

        path: "user",
        select: "firstName lastName email image"
    })
    .populate({
        path: "course",
        select: "courseName"
    })
    .exec();

    return allReviews;
}