import Post from "../models/post.model.js";
import user from "../models/user.model.js";
import Cloudinary from 'cloudinary';
const cloudinary = Cloudinary.v2;

export const createpost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userid = req.user._id.toString();
        const users = await user.findById(userid);
        if (!users) return res.status(404).json({ message: "User not found" });
        if (!text && !img) {
            return res.status(404).json({ error: "No image or text" })
        }
        if (img) {
            const uploadedres = await cloudinary.uploader.upload(img);
            img = uploadedres.secure_url;
        }
        const newpost = new Post({
            user: userid,
            text,
            img
        });
        await newpost.save();
        res.status(201).json(newpost);
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
        console.log(e)
    }
}
export const deletepost = async (req, res) => {
    try {
        const post = await post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete the post" })
        }
        if (post.img) {
            const imgid = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgid);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Internal server error" });
    }
}
export const commentpost = async (req, res) => {
    try {
        const { text } = req.body;
        const { postid } = req.params.id;
        const { userid } = req.user._id;
        if (!text) {
            return res.status(404).json({ error: "Text field is required" })
        }
        const post = await Post.findById(postid);
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }
        const comment = { user: userid, text }
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Internal server error" });
    }
}
export const likeunlike = async (req, res) => {
    try {
        const userid = req.user._id;
        const { id: postid } = req.params;
        const post = await Post.findById(postid);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const userlike = post.likes.includes(userid);
        if (userlike) {
            await Post.updateOne({ _id: postid }, { $pull: { likes: userid } })
            await user.updateOne({ _id: userid }, { $pull: { likedPosts: postid } })
            const updateLikes=post.likes.filter((id)=>id.toString()!==userid.toString())
            res.status(200).json(updateLikes)
        } else {
            post.likes.push(userid);
            await user.updateOne({ _id: userid }, { $pull: { likedPosts: postid } })
            await post.save();
            const notification = new Notification({
                from: userid,
                to: post.user,
                type: "like",
            })
            await notification.save()
            res.status(200).json(post.likes)
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getallpost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        })
            .populate({
                path: "comments.user",
                select: "-password",
            })
        if (posts.length == 0) {
            return res.status(200).json([])
        }
        return res.status(200).json(posts);
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getlikedposts = async (req, res) => {
    const userid = req.params.id;
    try {
        const users = await user.findById(userid)
        if (!users) return res.status(404).json({ error: "User not found" })
        const likepost = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password",
            }).populate({
                path: "comments.user",
                select: "-password",
            })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getfollowing = async (req, res) => {
    try {
        const userid = req.user._id
        const users = await user.findById(userid)
        if (!users) return res.status(404).json({ error: "User not found" })
        const following = user.following;
        const feedpost = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.users",
                select: "-password",
            })
        res.status(200).json(feedpost);
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getuserpost = async (req, res) => {
    try {
        const { username } = req.params;
        const users = await user.findOne({ username })
        if (!users) return res.status(404).json({ error: "User not found" })
        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path:"comments.users",
            select:"-password",
        })
        res.status(200).json(posts)
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "Internal server error" });
    }
}