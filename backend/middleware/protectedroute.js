import user from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectedroute=async(req,res)=> {
  try{
    const token=req.cookies.jwt;
    if(!token){
        return res.status(401).json({error:"Unauthorized:No token provieded"})
    }
    const decoded=jwt.verify(token, "1uXV6dbTgu0IrcVHTAh5z/oh02EwolOKWwW2oREDjcQ=");
    if(!decoded){
        return res.status(401).json({error:"Unauthorized:Invalid token"})
    }
    const User=await user.findById(decoded.userId).select("-password");
    if(!User){
        return res.status(404).json({error:"No User found"});
    }
    req.User=User;
    next()
  }catch(e){
    console.log("Error:",e.message);
    return res.status(500).json({error:"Internal server error"});
  }
}
