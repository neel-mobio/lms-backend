const { } = require("./creatorHelper");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const db = require("../../models/index");
const Creators = db.Creators;



exports.newCreator = (req, res) => {
    const data = req.body;
    try {
        console.log(data, "data")
        Creators.find({ email: req.body.email })
            .exec()
            .then((user) => {
                if (user.length >= 1) {
                    res.status(409).json({
                        message: "Email Exists"
                    })
                } else {
                    bcrypt.hash(req.body.password, 10, async (err, hash) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({
                                error: err,
                            });
                        } else {
                            const salt = await bcrypt.genSalt(10);
                            const password = await bcrypt.hash(req.body.password, salt);

                            const creator = new Creators({
                                _id: new mongoose.Types.ObjectId(),
                                first_name: data.firstName,
                                last_name: data.lastName,
                                email: data.email,
                                password: password,
                                confirm_password: password,
                                phone_no: data.phoneNo,
                                role: data.role,
                                address1: data.address1,
                                address2: data.address2,
                                city: data.city,
                                state: data.state,
                                country: data.country,
                                zip_code: data.zipCode,
                                profile: data.profile,
                                is_active: data.isActive,
                            });

                            creator
                                .save()
                                .then(async (result) => {
                                    await result
                                        .save()
                                    return res.status(201).json({
                                        message: "User is created...!!",
                                    });
                                })
                                .catch((err) => {
                                    console.log(err)
                                    return res.status(500).json({
                                        message: err.toString()
                                    })
                                });
                        }
                    });
                }
            });
    } catch (error) {
        return res.status(400).json({ error: "Something went to wrong..." })
    }
}

exports.listCreator = async (req, res) => {
    try {
        const creator = await Creators.find()
        return res.status(200).json({ creator })
    } catch (error) {
        return res.status(400).json({ error: "Something went to wrong..." })
    }
};

exports.creatorDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.creator_id;
        const creatorData = await Creators.findById(id)
        if (creatorData === undefined) {
            errors.push({ msg: "User data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ creatorData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};

exports.updateCreatorDetails = async (req, res) => {
    try {
        const id = req.params.creator_id;
        const data = req.body;
        // const { valid, errors } = validateRoleData(data);
        // if (!valid) {
        //     return res.status(400).json({
        //         errors
        //     });
        // }
        await Creators.findByIdAndUpdate(id,
            {
                $set: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    email: data.email,
                    // password: data.password,
                    // confirm_password: data.confirmPassword,
                    phone_no: data.phoneNo,
                    role: data.role,
                    address1: data.address1,
                    address2: data.address2,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    zip_code: data.zipCode,
                    profile: data.profile,
                    is_active: data.isActive,
                }
            },
        )
        const updatedCreatorData = await Creators.findById(id)
        return res.status(200).json({ userData: updatedCreatorData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.creatorRemove = async (req, res) => {
    try {
        const id = req.params.creator_id;
        const creatorRemoved = await Creators.findByIdAndRemove({ _id: id });
        if (creatorRemoved) {
            return res.status(200).json("user deleted...");
        } else {
            return res.status(400).json("user is not available")
        }
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};