import http from "http"
import app from "./app.js";
import dbConnect from "./config/dbConnect.js";
import dotenv from "dotenv"
import Razorpay from "razorpay";
dotenv.config();

const port = process.env.PORT;

const server = http.createServer(app);

export const instance = new Razorpay({

    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})

dbConnect().then(()=>{
    server.listen(port , ()=>{



        console.log(`Server running at http://localhost:${port}`);
        
    })
})
