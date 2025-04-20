import TryCatch from "../middleware/TryCatch.js";
import { Courses } from "../model/Courses.js";
import { loginUser } from "./user.js";
import { Lecture } from "../model/LectureSchema.js";
import {rm} from "fs";
import { promisify } from "util";
import fs from "fs"
import { User } from "../model/userschema.js";



// Code to create the course

export const createCourse = TryCatch(async(req,res)=>{
    const {title ,description , category , createdBy , duration , price } = req.body;
    console.log(title ,description , category , createdBy , duration , price)
    const image = req.file;
    await Courses.create({
    title,
    description,
    category,
    createdBy,
    image:image.path,
    duration,
    price
   })
   
   res.status(201).json({
    message:"Course Created Successfully"
   })
})


//  Code to add the lecture 
// export const addLectures = TryCatch(async(req,res)=>{
//     const course = await Courses.findById(req.params.id);
//     if(!course){
//         return res.status(404).json({
//             message:"No Course found"
//         });

//     }
//      const {title , description } = req.body;
//      const file = req.file;

//      const lecture =  await Lecture.create({
//         title ,
//         description ,
//         video:file.path,
//         course:course._id
//      });

//      res.status(201).json({
//         message:"Lecture Added Successfully"
//      })
// })

export const addLectures = TryCatch(async (req, res) => {
    // Find the course by ID
    const course = await Courses.findById(req.params.id);
    console.log(course);
    
    if (!course) {
        return res.status(404).json({
            message: "No Course found"
        });
    }

    // Extract lecture details
    const { title, description } = req.body;
    const file = req.file;

    // Create a new lecture
    const lecture = await Lecture.create({
        title,
        description,
        video: file?.path,
        course: course._id
    });

    

    res.status(201).json({
        message: "Lecture Added Successfully",
        lecture
    });
});



// Code to delete the lectures
export const deleteLecture = TryCatch(async(req,res)=>{
    const lecture = await Lecture.findById(req.params.id);
    rm(lecture.video , ()=>{
        console.log("Video deleted")
    });

    await lecture.deleteOne();
    res.json({message:"Lecture Deleted Successfully"})
})

const unlikeAsync = promisify(fs.unlink); //  To delete the file from the folder or the directory


// Code to delete the course
export const deleteCourse = TryCatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id);
    const lectures = await Lecture.find({course:course._id});
    await Promise.all(
        lectures.map(async(lecture)=>{
        await unlikeAsync(lecture.video);
        console.log("Video Deleted")

        })
    )
    rm(course.image , ()=>{
        console.log("Image deleted")
    });

    await Lecture.find({course:req.params.id}).deleteMany();
    await course.deleteOne();
   
     await User.updateMany({} , {$pull : {subscription:req.params.id}});
     res.json({message:"Course Deleted Successfully"})

})

export const getAllStats = TryCatch(async(req,res)=>{
    const totalCourses = (await Courses.find()).length
    const totalLectures = (await Lecture.find()).length;
    const totalUser = (await User.find()).length;

    const stats = {
        totalCourses ,
        totalLectures , 
        totalUser ,
    }

    res.json({
        stats,
    })
})

export const getAllUser = TryCatch(async (req, res) => {
    console.log("📌 getAllUser route hit");
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
//   if (req.user.mainrole !== "superadmin")
//     return res.status(403).json({
//       message: "This endpoint is assign to superadmin",
//     });
  const user = await User.findById(req.params.id);

  if (user.role === "user") {
    user.role = "admin";
    await user.save();

    return res.status(200).json({
      message: "Role updated to admin",
    });
  }

  if (user.role === "admin") {
    user.role = "user";
    await user.save();

    return res.status(200).json({
      message: "Role updated",
    });
  }
});

