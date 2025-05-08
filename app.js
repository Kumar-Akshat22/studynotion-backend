import cookieParser from "cookie-parser";
import express from "express"
import morgan from "morgan";
import cors from "cors";
import profileRoutes from "./routes/profile.routes.js"
import userRoutes from "./routes/user.routes.js"
import courseRoutes from "./routes/course.routes.js"
import paymentRoutes from "./routes/payments.routes.js"


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({

    origin: ["http://localhost:5173" , "http://localhost:5174"],
    credentials: true,
}));
app.use(express.urlencoded({extended: false}))

app.use('/api/v1/auth' , userRoutes);
app.use('/api/v1/profile' , profileRoutes);
app.use('/api/v1/course' , courseRoutes);
app.use('/api/v1/payment' , paymentRoutes);


app.get('/' , (req , res)=>{

    res.send("Hello World");
});

export default app
