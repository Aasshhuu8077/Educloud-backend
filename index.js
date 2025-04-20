import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './Database/db.js';
import Razorpay from 'razorpay'
import { User } from './model/userschema.js';
import cors from "cors"

const port = 8120;
export const instance = new Razorpay({
    key_id: "rzp_test_5a8w8amerefgtu",
    key_secret: "fyy3I4Slnx89pOyfkKBJjxaK",
})

const app = express();
app.use(express.json());
dotenv.config();

app.use(express.json());
app.use(cors()); // to establish 


app.get("/" , (req,res)=>{
    res.send("Hello World");
})

app.use("/uploads",express.static("uploads"))

// importing the routes
import userRoutes from './routes/user.js'
import courseRoutes from './routes/course.js'
import adminRoutes from './routes/admin.js'


// using the routes
app.use('/api' , userRoutes);
app.use('/api' , courseRoutes);
app.use('/api' , adminRoutes);


























app.listen(port ,()=>{
    console.log('server is running')
    connectDB();
})