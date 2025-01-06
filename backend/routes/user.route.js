import express from "express";
import { followunfollow, getsuggesteduser, getuserprofile, updateprofile } from "../controllers/user.controller.js";
import { protectedroute } from "../middleware/protectedroute.js";
const router=express.Router()
router.get("/profile/:username",protectedroute,getuserprofile)
router.get("/suggested",protectedroute,getsuggesteduser)
router.post("/follow/:id",protectedroute,followunfollow)
router.post("/update",protectedroute,updateprofile)
export default router;