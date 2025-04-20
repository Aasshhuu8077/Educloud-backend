import TryCatch from "../middleware/TryCatch.js";
import { instance } from "../index.js";
import { Payment  } from "../model/Payment.js";
import { Courses } from "../model/Courses.js";
import { Lecture } from "../model/LectureSchema.js";
import { User } from "../model/userschema.js";
import crypto from 'crypto'





// Code too get the all courses 
export const getAllCourses = TryCatch(async(req,res)=>{
    const courses = await Courses.find();
    res.json({
        courses,




        
    });
});

// Get the single course

export const getSingleCourse  = TryCatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id)
     res.json({
        course
     })
})



// code to fetch the lectures
export const fetchLectures = TryCatch(async(req,res)=>{
    const lectures = await Lecture.find({course:req.params.id});

    const user = await User.findById(req.user._id);

    if(user.role == "admin"){
        return res.json({lectures})
    }
   
    if(!user.subscription.includes(req.params.id)){
        return res.status(400).json({
            message:"You have not Subscribed to this Courses"
        })
    }
    res.json({lectures});
})


// code the
export const fetchlecture = TryCatch(async(req,res)=>{
    const lecture = await Lecture.findById(req.params.id);

    const user = await User.findById(req.user._id);


  // Checking weather the person is admin or user
    if(user.role == "admin"){
        return res.json({lecture})
    }
   
    if(!user.subscription.includes(req.params.id)){
        return res.status(400).json({
            message:"You have not Subscribed to this Courses"
        })
    }
    res.json({lecture})
})


export const getMycourses = TryCatch(async(req,res)=>{
   const courses = await Courses.find({_id: req.user.subscription});

   res.json({
    courses,
   })
})

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const course = await Courses.findById(req.params.id);

  console.log("hello")

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You already have this course",
    });
  }

  const options = {
    amount: Number(course.price * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(201).json({
    order,
    course,
  });
});


export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256",  process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  console.log("hello2")

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const user = await User.findById(req.user._id);

    const course = await Courses.findById(req.params.id);
    
    

      user.subscription.push(course._id);

    // await Progress.create({
    //   course: course._id,
    //   completedLectures: [],
    //   user: req.user._id,
    // });

     await user.save();

    

    res.status(200).json({
      message: "Course Purchased Successfully",
    });
  } else {
    return res.status(400).json({
      message: "Payment Failed",
    });
  }
});