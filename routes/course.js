import express from 'express'
import { fetchlecture, fetchLectures, getAllCourses, getSingleCourse  , checkout , paymentVerification, getMycourses} from '../controllers/course.js';
import { isAuth } from '../middleware/isauth.js';

const router = express.Router();

//Route to view the all course
router.get("/course/all" , getAllCourses)
//Route to view the single course
router.get("/course/:id" , getSingleCourse)
//Route to get all lectures in the particular course
router.get("/lectures/:id" , isAuth , fetchLectures)
router.get("/mycourse" , isAuth , getMycourses)
// Route to fetch the single lecture
router.get("/lecture/:id" , isAuth , fetchlecture)
router.post("/course/checkout/:id", isAuth, checkout);
router.post("/verification/:id", isAuth, paymentVerification);


export default router;