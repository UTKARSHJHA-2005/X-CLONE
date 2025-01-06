import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    Name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    profileimg: {
        type: "String",
        default: "",
    },
    coverimg: {
        type: "String",
        default: "",
    },
    bio: {
        type: "String",
        default: "",
    },
    link: {
        type: "String",
        default: "",
    },
    likePosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: [],
        },
    ],
}, { timestamps: true });
const user = mongoose.model("User", userSchema);
export default user;