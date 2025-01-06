import user from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";
import Notification from "../models/notification.model.js";

export const getuserprofile = async (req, res) => {
    const { username } = req.params;
    try {
        const User = user.findOne({ username }).select("-password")
        if (!User) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json(User)
    } catch (e) {
        console.log("Error in getting profile:", e.message)
        return res.status(500).json({ error: e.message })
    }
}
export const followunfollow = async (req, res) => {
    try {
        const { id } = req.params;
        const usermod = await user.findById(id);
        const currentUser = await user.findById(req.user._id)
        if (id == req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }
        if (!usermod || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }
        const isfollow = currentUser.following.includes(id);
        if (isfollow) {
            await user.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await user.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            await user.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await user.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });
            await newNotification.save();
            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (e) {

    }
}
export const getsuggesteduser = async (req, res) => {
    const userid = req.user._id;
    const userfollowedbyme = await user.findById(userid).select("following");
    const users = await user.aggregate([
        {
            $match: {
                _id: { $ne: userid }
            }
        },
        { $sample: { size: 10 } }
    ])
    const filteruser = users.filter((user) => !userfollowedbyme.following.includes(user._id))
    const suggestuser = filteruser.slice(0, 4);
    suggestuser.forEach((user) => (user.pass))
}
export const updateprofile = async (req, res) => {
    const { Name, email, username, currentpassword, newpassword, bio, link } = req.body;
    let { profileimg, coverimg } = req.body;
    const userId = req.user._id;
    try {
        let users = await user.findById(userId);
        if (!users) return res.status(404).json({ message: "User not found" })
        if (!currentpassword && !newpassword) return res.status(400).json({ message: "Please provide passwords" })
        if (currentpassword && newpassword) {
            const ismatch=await bcrypt.compaare(currentpassword,users.password)
            if(!ismatch) return res.status(400).json({error:"Password is incorrect"})
            const salt=await bcrypt.genSalt(10)
            users.password=await bcrypt.hash(newpassword,salt);
        }
        if(profileimg){
            if(users.profileimg){
                await cloudinary.uploader.destroy(users.profileimg.split("/").pop().split(".")[0]);
            }
            const uploadedres=await cloudinary.uploader.upload(profileimg);
            profileimg=uploadedres.secure_url;
        }
        if(coverimg){
            if(users.coverimg){
                await cloudinary.uploader.destroy(users.coverimg.split("/").pop().split(".")[0]);
            }
            const uploadedres=await cloudinary.uploader.upload(coverimg);
            coverimg=uploadedres.secure_url;
        }
        users.Name=Name|| users.Name;
        users.email=email|| users.email;
        users.username=username || users.username;
        users.bio=bio || users.bio;
        users.link=link || users.link;
        users.profileimg=profileimg || users.profileimg;
        users.coverimg=coverimg || users.coverimg;
        users=await users.save();
        users.password=null;
        return res.status(200).json(users);
    } catch (e) {

    }
}