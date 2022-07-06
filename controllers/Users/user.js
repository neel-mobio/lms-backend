const { validateUserData } = require('./userHelper');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const db = require("../../models/index");
const Users = db.Users;


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
        const userData = await Users.findByIdAndUpdate(req.params.user_id,
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
        return res.status(200).json({ userData: userData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.userRemove = async (req, res) => {
    try {
        const id = req.params.user_id;
        await Users.findByIdAndRemove({ _id: req.params.user_id });
        return res.status(200).json("User deleted...")
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
        const data = await db.collection("books").doc(bid);
        await data.update({ book_available: false });
        const book = await data.get();
        const bookData = book.data();
        let x = new Date();
        x.setDate(new Date().getDate() + 10);
        const bookAdd = {
            book_id: bid,
            book_name: bookData.book_name,
            book_issuedate: new Date(),
            book_return_due_date: x,
            book_status: "Issue"
        }
        // const userData = await db.collection("users").doc(uid);
        // const ud = await userData.get();
        // const updatedData = ud.data();
        const userData = await Users.findByIdAndUpdate(req.params.user_id,
            {
                $set: {
                    user_havebook:bookAdd
                }
            },
        )
        // console.log(updatedData.user_havebook,"get all data")
        // const ub = updatedData.user_havebook
        // ub.push(bookAdd)
        // await userData.update({
        //     user_havebook: ub
        // });
        console.log(userData,"data")
        return res.status(200).json({ bookData: bookData, userData: userData })
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
        const data = await db.collection("books").doc(bid);
        await data.update({ book_available: true });
        const book = await data.get();
        const bookData = book.data();
        const userData = await db.collection("users").doc(uid);
        const ud = await userData.get();
        const updatedData = ud.data();
        const ub = updatedData.user_havebook
        // await userData.update({
        //     "user_havebook": db.FieldValue.arrayRemove({"book_id": bid , "book_givendate":bookData.book_givendate , "book_name":bookData.book_name, "book_recevieddate":bookData.book_recevieddate})
        // });
        let remainingBook = [];
        ub.forEach((doc) => {
            if (doc.book_id === bid) {
                remainingBook.push(
                    {
                        book_issuedate: doc.book_issuedate,
                        book_return_due_date: doc.book_return_due_date,
                        book_returndate: new Date(),
                        book_name: doc.book_name,
                        book_id: doc.book_id,
                        book_status: doc.book_status = "Returned"
                    }
                )
            } else {
                remainingBook.push(doc);
            }
        })
        await userData.update({
            user_havebook: remainingBook
        })
        return res.status(200).json({ bookData: bookData, userData: updatedData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}