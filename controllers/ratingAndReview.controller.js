import * as ratingAndReviewsServices from '../services/ratingAndReview.service.js'

// Create Rating
export const createRatingController = async (req , res) => {
    
    try {
        
        const userId = req.user.id;
        const {courseId , rating , review} = req.body;

        const updatedCourseDetails = await ratingAndReviewsServices.createRating(userId , courseId , rating , review);

        return res.status(200).json({

            success: true,
            message: "Rating and Review successfully added",
            updatedCourseDetails
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const updateRatingController = async (req , res) => {
    
    try {
        
        const userId = req.user.id;
        const {courseId , rating , review} = req.body;

        const updatedReviewDetails = await ratingAndReviewsServices.updateRating(userId , courseId , rating , review);

        return res.status(200).json({

            success: true,
            message: "Rating and Review successfully updated",
            updatedReviewDetails
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// Get Average Rating
export const getAverageRatingController = async (req , res) => {
    
    try {
        

        const response = await ratingAndReviewsServices.getAverageRating(req.body);
        
        if(response.averageRating === 0){

            return res.status(200).json({

                success: true,
                message: "Average rating is 0. No rating given till now for this course"
            })
        }

        return res.status(200).json({

            success: true,
            response
        })

    } catch (error) {
        
        return res.status(500).json({

            success: false,
            message: "Error in geting the average rating for the course",
            error: error.message
        })
    }
}

// Get all ratings for a particular course
export const getAllRatingAndReviewsController = async (req , res) => {
    
    try {
        
        const ratingResponse = await ratingAndReviewsServices.getAllRatingAndReviews()

        res.status(200).json({

            success: true,
            message: "Rating and Reviews details fetched successfully",
            ratingResponse
        })

    } catch (error) {
        
        return res.status(500).json({

            success: false,
            message: "Error in geting the rating and reviews details",
            error: error.message
        })
    }
}