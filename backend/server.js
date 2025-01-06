import express from "express"
import { configDotenv } from "dotenv";
import {v2 as cloudinary} from "cloudinary"
import authroute from "./routes/auth.route.js";
import userroute from "./routes/user.route.js";
import postroute from "./routes/post.route.js";
import { connectdb } from "./db/Connectdb.js";
import cookieParser from "cookie-parser";
const app=express()
configDotenv();
cloudinary.config({
    cloud_name:"dhszvdzft",
    api_key:"884712326743293",
    api_secret:"jxbPlTxgiqvzAm1u3oN8bSqQ3tk",
})
app.use(express.json({limit:"100kb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/api/auth",authroute)
app.use("api/users",userroute)
app.use("api/posts",postroute)
app.use("/api/notification",not)
app.listen(8000,()=>{
    console.log("Server is running")
    connectdb();
})