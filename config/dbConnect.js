import mongoose from "mongoose";

const dbConnect = async()=>{

    
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
    .then(()=>{

        console.log("DB CONNECTED")
    })
    .catch((err)=>{

        console.error("Error in Connecting DB",err);
        process.exit(1);
    })
}

export default dbConnect;