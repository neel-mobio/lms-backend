const { validateRoleData } = require('./roleHelper');
const mongoose = require("mongoose");
const db = require("../../models/index");
const Roles = db.Roles;

exports.newRole = (req, res) => {
    const data = req.body;
    Roles.find({ role_name: req.body.roleName })
        .exec()
        .then((role) => {
            if (role.length >= 1) {
                res.status(409).json({
                    message: "Role already Exists"
                })
            } else {
                const role = new Roles({
                    _id: new mongoose.Types.ObjectId(),
                    role_name: data.roleName,
                    display_name: data.displayName,
                    discription: data.discription,
                    role_permissions:
                    {
                        manage_books: data.manageBooks || false,
                        manage_issue_books: data.manageIssueBooks || false,
                        manage_members: data.manageMembers || false,
                        manage_finance: data.manageFinance || false,
                        manage_settings: data.manageSettings || false,
                        manage_roles: data.manageRoles || false,
                        manage_authors: data.manageAuthors || false,
                        manage_publishers: data.managePublishers || false,
                        manage_book_series: data.manageBookSeries || false,
                        manage_users: data.manageUsers || false,
                        manage_book_languages: data.manageBookLanguages || false,
                        manage_plans: data.managePlans || false,
                        manage_tags: data.manageTags || false,
                        manage_genres: data.manageGenres || false,
                        manage_book_requests: data.manageBookRequests || false,
                        manage_penalties: data.managePenalties || false,
                        manage_editors: data.manageEditors || false,
                        manage_book_types: data.manageBookTypes || false,
                        manage_libraries: data.manageLibraries || false,
                        manage_writers: data.manageWriters || false,
                    }

                    // role_permissions: data.permissions,
                    // user_type: data?.user_type || "member",
                });
                role
                    .save()
                    .then(async (result) => {
                        await result
                            .save()
                        return res.status(201).json({
                            message: "Role is created...!!",
                        });
                    })
                    .catch((err) => {
                        console.log(err)
                        return res.status(500).json({
                            message: err.toString()
                        })
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

exports.listRole = async (req, res) => {
    try {
        const roles = await Roles.find()
        return res.status(200).json({ roles: roles })
    } catch (error) {
        return res.status(400).json({ error: "Something went to wrong..." })
    }
};

exports.roleDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.role_id;
        const roleData = await Roles.findById(id)
        if (roleData === undefined) {
            errors.push({ msg: "Role data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ roleData: roleData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};

exports.updateRoleDetails = async (req, res) => {
    try {
        const id = req.params.role_id;
        const data = req.body;
        const { valid, errors } = validateRoleData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        await Roles.findByIdAndUpdate(id,
            {
                $set: {
                    role_name: data.roleName,
                    display_name: data.displayName,
                    discription: data.discription,
                    role_permissions:
                    {
                        manage_books: data.manageBooks || false,
                        manage_issue_books: data.manageIssueBooks || false,
                        manage_members: data.manageMembers || false,
                        manage_finance: data.manageFinance || false,
                        manage_settings: data.manageSettings || false,
                        manage_roles: data.manageRoles || false,
                        manage_authors: data.manageAuthors || false,
                        manage_publishers: data.managePublishers || false,
                        manage_book_series: data.manageBookSeries || false,
                        manage_users: data.manageUsers || false,
                        manage_book_languages: data.manageBookLanguages || false,
                        manage_plans: data.managePlans || false,
                        manage_tags: data.manageTags || false,
                        manage_genres: data.manageGenres || false,
                        manage_book_requests: data.manageBookRequests || false,
                        manage_penalties: data.managePenalties || false,
                        manage_editors: data.manageEditors || false,
                        manage_book_types: data.manageBookTypes || false,
                        manage_libraries: data.manageLibraries || false,
                        manage_writers: data.manageWriters || false,
                    }

                }
            },
        )
        const updatedRoleData = await Roles.findById(id)
        return res.status(200).json({ roleData: updatedRoleData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.roleRemove = async (req, res) => {
    try {
        const id = req.params.role_id;
        const roleRemoved = await Roles.findByIdAndRemove({ _id: id });
        if (roleRemoved) {
            return res.status(200).json("Role deleted...");
        } else {
            return res.status(400).json("Role is not available")
        }
        // return res.status(200).json("Role deleted...")
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
};