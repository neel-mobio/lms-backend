const router = require("express");
const db = require("../models/index");
const UserLogin = db.UserLogin;
const Creators = db.Creators;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = router.Router();
require("dotenv").config();

const { registerValidation } = require("./validation");


// wothout controller setup :) 
auth.post("/register", async (req, res) => {

    // validate the user
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }


    const isEmailExist = await UserLogin.findOne({ email: req.body.email });
    // throw error when email already registered
    if (isEmailExist) {
        return res.status(400).json({ error: "Email already exists" });
    }

    // encrypt password :)
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    console.log(salt, "salt encrypted password");
    console.log(password, "get encrypted password");
    const user = new UserLogin({
        name: req.body.name,
        email: req.body.email,
        password: password,
    });
    try {
        const savedUser = await user.save();
        return res.status(200).json({ error: null, data: savedUser });
    } catch (error) {
        res.status(400).json({ error });
    }
});

// login route
auth.post("/login", async (req, res) => {
    // validate the user
    // const { error } = registerValidation(req.body);
    // throw validation errors
    // if (error) return res.status(400).json({ error: error.details[0].message });
    const user = await Creators.findOne({ email: req.body.email });
    // throw error when email is wrong
    if (!user) return res.status(400).json({ error: "Email is wrong" });
    // check for password correctness
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).json({ error: "Password is wrong" });
    const userRole = user.role;
    res.cookie(`Role`, userRole);
    // create token
    const token = jwt.sign(
        // payload data
        {
            name: user.name,
            id: user._id,
            role:userRole
        },
        process.env.TOKEN_SECRET
    );

    return res.header("auth-token", token).json({
        error: null,
        data: {
            token,
        },
    });
});


module.exports = auth;