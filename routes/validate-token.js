const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const db = require("../models/index");
const Roles = db.Roles;
// middleware to validate token
const verifyToken = async (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) return res.status(401).json({ error: "Access denied" });
    const role = req.cookies.Role
    console.log(role, "tokennnnn")
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        const data = await Roles.find({ role_name: role })
        console.log(verified, "dada")
        next();
    } catch (err) {
        res.status(400).json({ error: "Token is not valid" });
    }
};
module.exports = verifyToken;