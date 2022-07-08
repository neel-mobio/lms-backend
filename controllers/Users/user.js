const { validateUserData } = require('./userHelper');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const db = require("../../models/index");
const Users = db.Users;
const Books = db.Books;


exports.newUser = (req, res, next) => {
    const data = req.body;
    Users.find({ user_email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: "Email Exists"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({
                            error: err,
                        });
                    } else {
                        const user = new Users({
                            _id: new mongoose.Types.ObjectId(),
                            user_firstname: data.firstName,
                            user_lastname: data.lastName,
                            user_type: data?.user_type || "member",
                            member_code: data.member_code,
                            library: data.library,
                            user_status: true,
                            user_havebook: [],
                            user_phone_number: data.phoneNumber,
                            user_email: data.email,
                            user_password: data.password,
                            user_profile: data.url,
                            is_deleted: false,
                            // user_deposit: data?.deposit || 2000,
                            // created_at: new Date(),
                        });
                        user
                            .save()
                            .then(async (result) => {
                                await result
                                    .save()
                                    .then((result1) => {
                                        console.log(`User created ${result}`)
                                        console.log(`User created1111 ${result1}`)
                                        res.status(201).json({
                                            userDetails: {
                                                result1
                                                // _id: new mongoose.Types.ObjectId(),
                                                // user_firstname: result.user_firstname,
                                                // user_lastname: result.user_lastname,
                                                // user_type: result?.user_type || "member",
                                                // member_code: result.member_code,
                                                // library: result.library,
                                                // user_status: true,
                                                // user_havebook: [],
                                                // user_phone_number: result.user_phone_number,
                                                // user_email: result.user_email,
                                                // user_password: result.user_password,
                                                // user_profile: result.user_profile,
                                                // is_deleted: false,
                                            },
                                        })
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                        res.status(400).json({
                                            message: err.toString()
                                        })
                                    });
                            })
                            .catch((err) => {
                                console.log(err)
                                res.status(500).json({
                                    message: err.toString()
                                })
                            });
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                message: err.toString()
            })
        });
}

exports.listUsers = async (req, res) => {
    try {
        const users = [];
        await Users.find({
            $and: [
                { is_deleted: false }
            ],
        })
            .then(items =>
                users.push(items)
            );
        return res.status(200).json({ users: users })
    } catch (error) {
        return res.status(400).json({ error: "Something want to wrong..." })
    }
};

exports.userDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.user_id;
        const userData = await Users.find({
            $and: [
                { _id: req.params.user_id }
            ],
        })
        if (userData === undefined) {
            errors.push({ msg: "User data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ userData: userData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};

exports.updateUserDetails = async (req, res) => {
    try {
        const id = req.params.user_id;
        const data = req.body;
        const { valid, errors } = validateUserData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        await Users.findByIdAndUpdate(id,
            {
                $set: {
                    user_firstname: req.body.firstName,
                    user_lastname: req.body.lastName,
                    user_phone_number: req.body.phoneNumber,
                    user_password: req.body.password,
                    user_profile: req.body.url,
                    user_email: req.body.email,
                    user_password: req.body.password
                }
            },
        )
        const updatedUserData = await Users.find({
            $and: [
                { _id: id }
            ],
        })
        return res.status(200).json({ userData: updatedUserData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.userRemove = async (req, res) => {
    try {
        const id = req.params.user_id;
        const userRemoved = await Users.findByIdAndRemove({ _id: id });
        if (userRemoved) {
            return res.status(200).json("User deleted...");
        } else {
            return res.status(400).json("User is not available")
        }
        // return res.status(200).json("User deleted...")
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}

exports.issuesBook = async (req, res) => {
    const uid = req.params.user_id;
    const bid = req.params.book_id;
    try {
        const updateBook = await Books.findByIdAndUpdate(bid,
            {
                $set: {
                    book_available: false
                }
            },
        )
        let x = new Date();
        x.setDate(new Date().getDate() + 10);
        const bookAdd = {
            book_id: bid,
            book_name: updateBook.book_name,
            book_issuedate: new Date(),
            book_return_due_date: x,
            book_status: "Issue"
        }
        await Users.findByIdAndUpdate(uid,
            {
                $push: {
                    user_havebook: bookAdd
                }
            },
        )
        const updatedBookData = await Books.find({
            $and: [
                { _id: bid }
            ],
        })
        const updatedUserData = await Users.find({
            $and: [
                { _id: uid }
            ],
        })
        return res.status(200).json({ bookData: updatedBookData, userData: updatedUserData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}

exports.deliverBook = async (req, res) => {
    const uid = req.params.user_id;
    const bid = req.params.book_id;
    try {
        await Books.findByIdAndUpdate(bid,
            {
                $set: {
                    book_available: true
                }
            },
        )
        const updatedUserData = await Users.find({ _id: uid })
        let remainingBook = [];
        updatedUserData.forEach((doc) => {
            doc.user_havebook.forEach((data) => {
                if (data.book_id === bid) {
                    remainingBook.push(
                        {
                            book_issuedate: data.book_issuedate,
                            book_return_due_date: data.book_return_due_date,
                            book_returndate: new Date(),
                            book_name: data.book_name,
                            book_id: data.book_id,
                            book_status: data.book_status = "Returned"
                        }
                    )
                } else {
                    remainingBook.push(data)
                }
            })
        })
        console.log(remainingBook, "finally")
        await Users.findByIdAndUpdate(uid,
            {
                $push: {
                    user_havebook: remainingBook
                }
            },
        )
        const updatedBookData = await Books.find({
            $and: [
                { _id: bid }
            ],
        })
        const updateUserData = await Users.findById({ _id: uid })
        return res.status(200).json({ bookData: updatedBookData, userData: updatedUserData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}