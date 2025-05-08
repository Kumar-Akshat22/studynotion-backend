// The following is the secret in the encrypted coming from the webhook of Razorpay after successfull payment 
    const signature = req.headers["x-razorpay-signature"]
    
    const webhookSecret = "12345678";

    // 3 steps to convert the webhookSecret into the encrypted format just like the signature
    const shasum = crypto.createHmac("sha256" , webhookSecret)

    shasum.update(JSON.stringify(req.body));

    const digest = shasum.digest("hex");

    if(signature === digest){

        // Now, the payment is authorized
        console.log("Payment is authorized");
        const {courseId , userId} = req.body.payload.payment.entity.notes;
        
        // Perform the required action -> means enroll the current student into the specific course
        try {
            
            const enrolledCourse = await course.findByIdAndUpdate(
                {_id: courseId},
                {
                    $push: {
                        studentsEnrolled: userId
                    }
                },
                {new : true}
            )

            if(!enrolledCourse){

                return res.status(500).json({

                    success: false,
                    message: "Course not found",
                })
            }

            const updatedStudentDetails = await User.findByIdAndUpdate(
                {_id: userId},
                {$push: {
                    courses:courseId
                }},
                {new: true}
            )


            // Send the confirmation mail
            const emailResponse = await mailSender(
                updatedStudentDetails.email,
                "Course enrollement Successfull || Studynotion",
                "You have been successfully onboarded to the course"
            );

            return res.status(200).json({

                success: true,
                message: "Payment verified and course enrollment successfull",

            })

        } catch (error) {
            

            return res.status(500).json({

                success: false,
                message: "Error in payment signature verification",
                error: error.message,

            })
        }
    }

    else{

        return res.status(400).json({

            success: false,
            message: "Invalid payment signature",
        })
    }