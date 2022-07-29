
const mongoose = require("mongoose");
const db = require("../models/index");
const Roles = db.Roles;


const roleValidation = async (req, res, next) => {
    console.log(req.baseUrl, "::::BaseUrl:::::")
    try {
        const role = req.cookies.Role
        // console.log(role, "tokennnnn")
        const data = await Roles.find({ role_name: role })
        // console.log(data, "tokennnn");
        // console.log(data[0].role_permissions,"::::::");
        switch (req.baseUrl) {
            case '/users':
                if (data[0].role_permissions.manage_members === true) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            case '/books':
                if (data[0].role_permissions.manage_books === true) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            case '/librarys':
                if (data[0].role_permissions.manage_libraries === false) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            case '/author':
                if (data[0].role_permissions.manage_authors === true) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            case '/writer':
                if (data[0].role_permissions.manage_writers === true) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            case '/publisher':
                if (data[0].role_permissions.manage_publishers === true) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            case '/editor':
                if (data[0].role_permissions.manage_editors === true) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            case '/booktype':
                if (data[0].role_permissions.manage_book_types === true) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            case '/booklanguage':
                if (data[0].role_permissions.manage_book_languages === true) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            case '/role':
                if (data[0].role_permissions.manage_roles === false) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            case '/creator':
                if (data[0].role_permissions.manage_users === true) {
                    console.log("correct")
                    next();
                } else {
                    res.status(400).json({ error: "I got it is not valid" });
                }
                break;
            default:
                break;
        }
        // res.status(400).json({ error: "I got it is not valid" });
    } catch (error) {

    }
}

module.exports = roleValidation;