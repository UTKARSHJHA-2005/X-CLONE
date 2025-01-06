import express from "express"
import { protectedroute } from "../middleware/protectedroute.js";
import { deletenotifications, getnotification,deletenotification } from "../controllers/notification.controller.js";
const router=express.Router();
router.get("/",protectedroute,getnotification)
router.delete("/",protectedroute,deletenotifications)
router.delete("/:id",protectedroute,deletenotification)