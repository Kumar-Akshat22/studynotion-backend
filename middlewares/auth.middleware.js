import jwt, { decode } from "jsonwebtoken"

export const authUser = async (req , res , next) => {
    
    try {
        
        const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        console.log("Token: " , token); 
        if(!token){ 

            return res.status(401).json({

                success: false,
                message: "Token is missing"
            })
        }

        try {
            
            
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            console.log(decoded);
            req.user = decoded;

        } catch (error) {
            
            return res.status(401).json({

                success: false,
                message: "Token is invalid"
            })

        }

        next();

    } catch (error) {
        
        res.status(401).json({

            success: false,
            message: `Something went wrong while validating token ${error.message}`,
        })
    }
}

export const isStudent = async (req , res , next) => {
    

    try {
        

        if(req.user.role !== "Student"){

            return res.status(401).json({

                success: false,
                message: "This is the protected route for the Students only"
            })
        }

        next();


    } catch (error) {
        
        return res.status(500).json({

            success: false,
            message: "User role cannot be verified, Please try again"
        })
    }
}

export const isInstructor = async (req , res , next) => {
    

    try {
        

        if(req.user.role !== "Instructor"){

            return res.status(401).json({

                success: false,
                message: "This is the protected route for the Instructors only"
            })
        }

        next();


    } catch (error) {
        
        return res.status(500).json({

            success: false,
            message: "User role cannot be verified, Please try again"
        })
    }
}

export const isAdmin = async (req , res , next) => {
    

    try {
        

        if(req.user.role !== "Admin"){

            return res.status(401).json({

                success: false,
                message: "This is the protected route for the Admin only"
            })
        }

        next();


    } catch (error) {
        
        return res.status(500).json({

            success: false,
            message: "User role cannot be verified, Please try again"
        })
    }
}
