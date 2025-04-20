import express from 'express'
import { isAdmin, isAuth } from '../middleware/isauth.js';
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats ,updateRole,getAllUser} from '../controllers/admin.js';
import { uploadFiles } from '../middleware/multer.js';

const router = express.Router();



router.get("/stats" , isAuth , isAdmin , getAllStats)
// Route to add the new course
router.post('/course/new'   ,isAuth , isAdmin ,uploadFiles, createCourse);
//  Route to add a lecture in a particular course
router.post("/course/:id" , isAuth , isAdmin ,uploadFiles ,addLectures)
// Route to delete a particular course
router.delete("/course/:id" , isAuth , isAdmin , deleteCourse)
// Route to delete a particular lecture
router.delete("/lecture/:id" , isAuth , isAdmin , deleteLecture)
router.put("/user/:id", isAuth, updateRole);
router.get("/users", isAuth, isAdmin, getAllUser);

router.get("/test-users", (req, res) => {
    console.log("✅ /api/test-users hit");
    res.json({ message: "Test users route working" });
  });
  

export default router;