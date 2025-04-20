import express from 'express'
import { loginUser, myprofile, register, Verifyuser } from '../controllers/user.js';
import { isAuth } from '../middleware/isauth.js';



const router = express.Router(); 
// Route for login
router.post("/user/login" , loginUser);
// Route for register
router.post("/user/register" , register)
//Route for verify
router.post("/user/verify" , Verifyuser)
//Route for my profile
router.get("/user/me" , isAuth , myprofile);
























export default router;