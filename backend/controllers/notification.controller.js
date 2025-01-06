import Notification from "../models/notification.model";
export const getnotification = async (req, res) => {
    try {
        const userid=req.user._id;
        const notifications=await Notification.find({to:userid}).populate({
            path:"from",
            select:"username profileimg",
        });
        await Notification.updateMany({to:userid},{read:true})
        res.status(200).json(notifications)
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const deletenotifications=async(req,res)=>{
    try{
        const userid=req.user._id;
        await Notification.deleteMany({to:userid})
        res.status(200).json({error:"Notification deleted"})
    }catch(e){
        console.log(e.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}
export const deletenotification=async(req,res)=>{
    try{
        const notificationid=req.params.id;
        const userid=req.user._id;
        const notification=await Notification.findById(notificationid)
        if(!notification){
            return res.status(404).json({error:"Notification not found"})
        }
        if(notification.to.toString()!==userid.toString()){
            return res.status(403).json({error:"You are not allowed to delete"})
        }
        await Notification.findByIdAndDelete(notificationid)
        res.status(200).json({message:"Notification deleted"})
    }catch(e){
        console.log(e.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}