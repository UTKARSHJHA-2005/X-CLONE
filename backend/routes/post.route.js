import express from "express";
import { protectedroute } from "../middleware/protectedroute.js";
import { commentpost, createpost, deletepost, getallpost, getfollowing, getlikedposts, getuserpost, likeunlike } from "../controllers/post.controller.js";
const router=express.Router();
router.get("/all",protectedroute,getallpost)
router.get("/following",protectedroute,getfollowing)
router.get("/likes/:id",protectedroute,getlikedposts)
router.get("/user/:username",protectedroute,getuserpost)
router.post("/create",protectedroute,createpost)
router.post("like/:id",protectedroute,likeunlike)
router.post("/comment/:id",protectedroute,commentpost);
router.delete("/:id",protectedroute,deletepost);
export default router;