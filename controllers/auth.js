const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if (!user) {
        return res.status(400).json({message: "User not found"});
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({message: "Invalid password"}); 
    }

    const payload = {_id: user._id, username: user.username}

    const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXP_TIME})
    const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXP_TIME})

    res.cookie("refresh_token", refresh_token)

    res.status(200).json({
        message: "Signed In successfully",
        data: {
            user,
            access_token,
        }
    })
}

const signup = async (req, res) => {
    const {username, password} = req.body;

    const existingUser = await User.findOne({username})
    if (existingUser) {
        return res.status(400).json({message: "Username already exists"})
    }

    const hashedPassword = await bcrypt.hashSync(password, 10)
    const newUser = new User({username, password: hashedPassword})

    await newUser.save()

    res.status(201).json({message: "User created successfully"})
}

const refreshAccessToken = async (req, res) => {
    const {refresh_token} = req.cookies;

    const decodedRefreshToken = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    if (!decodedRefreshToken) {
        return res.status(400).json({
            message: "Refresh token is invalid"
        })
    }

    const {_id, username} = decodedRefreshToken;
    const newAccessToken = jwt.sign({_id, username}, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXP_TIME});

    res.status(200).json({
        access_token: newAccessToken,
    })
}


module.exports = {
    login,
    signup,
    refreshAccessToken,
}