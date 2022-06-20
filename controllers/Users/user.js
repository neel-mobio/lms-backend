const { db,firebaseSecondaryApp } = require("../../config/admin")
const { validateUserData } = require('./userHelper')


exports.newUser = async (req, res) => {
    try {
        const data = req.body 
        console.log(req.body,"body********")
        const userData = {
            user_firstname: data.firstName,
            user_lastname: data.lastName,
            user_type: "member",
            user_phone_number: data.phoneNumber,
            user_email: data.email,
            user_password: data.password,
            user_profile: data.url,
            is_deleted: false,
            created_at: new Date(),
        };
        // const { valid, errors } = validateUserData(userData);
        // if (!valid) {
        //     return res.status(400).json({
        //         errors,
        //     });
        // } else {
            const newAdmin = await firebaseSecondaryApp
                // .auth()
                .createUserWithEmailAndPassword(userData.user_email,userData.user_password);

            await db.collection("users").doc(newAdmin.user.uid).set(userData);
            // firebaseSecondaryApp.auth().signOut();
            return res.status(200).json({
                message: "Admin is created...!!",
            });
        // }
    } catch (error) {
        const errors = [];
        // if (error.code == "auth/email-already-in-use") {
        //     errors.push({ msg: "Email already exists!" });
        //     return res.status(400)({
        //         errors,
        //     });
        // }
        // errors.push({ msg: error.message });
        return res.status(400)({ errors:"something want to worng" });
    }
};


exports.listUsers = async (req, res) => {
    try {
        const users = [];
        const data = await db.collection("users").orderBy('created_at', 'desc').get();
        data.forEach((doc) => {
            if (
                (doc.data().user_type == "Member" || doc.data().user_type == "member") &&
                doc.data().is_deleted === false
            ) {
                const user = { id: doc.id, userData: doc.data() };
                users.push(user);
            }
        });
        return res.status(200).json({ users: users })
    } catch (error) {
        return res.status(400).json({ error: "Something want to wrong..." })
    }
};
