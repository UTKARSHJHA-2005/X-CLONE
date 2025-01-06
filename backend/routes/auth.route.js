import express from "express";
import { logout,login,signup, getme } from "../controllers/auth.controller.js";
import { protectedroute } from "../middleware/protectedroute.js";
const router=express.Router()
router.get("/me",protectedroute,getme)
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
export default router;