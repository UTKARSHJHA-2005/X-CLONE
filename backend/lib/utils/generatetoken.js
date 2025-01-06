import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, "1uXV6dbTgu0IrcVHTAh5z/oh02EwolOKWwW2oREDjcQ=", {
        expiresIn: "30d",
    });

    // Set cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development", // Secure in production
    });
};
