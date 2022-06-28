const { db, firebaseSecondaryApp } = require("../../config/admin")
const { validateUserData } = require('./userHelper')


exports.newUser = async (req, res) => {
    const data = req.body
    const { valid, errors } = validateUserData(data);
    try {
        if (!valid) {
            return res.status(400).json({
                errors,
            });
        } else {
            const userData = {
                user_firstname: data.firstName,
                user_lastname: data.lastName,
                user_type: data?.user_type || "member",
                member_code:data.member_code,
                library:data.library,
                user_status:true,
                user_havebook: [],
                user_phone_number: data.phoneNumber,
                user_email: data.email,
                user_password: data.password,
                user_profile: data.url,
                is_deleted: false,
                // user_deposit: data?.deposit || 2000,
                created_at: new Date(),
            };
            const newUser = await firebaseSecondaryApp.auth().createUserWithEmailAndPassword(userData.user_email, userData.user_password);
            await db.collection("users").doc(newUser.user.uid).set(userData);
            // firebaseSecondaryApp.auth().signOut();
            return res.status(200).json({
                message: "User is created...!!",
            });
        }
    }
    catch (error) {
        const errors = [];
        if (error.code == "auth/email-already-in-use") {
            errors.push({ msg: "Email already exists!" });
            return res.status(400)({
                errors,
            });
        }
        errors.push({ msg: error.message });
        return res.status(400).json({ errors: "something want to worng" });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const users = [];
        const data = await db.collection("users").orderBy('created_at', 'desc').get();
        data.forEach((doc) => {
            if (doc.data().is_deleted === false) {
                const user = { id: doc.id, userData: doc.data() };
                users.push(user);
            }
        });
        return res.status(200).json({ users: users })
    } catch (error) {
        return res.status(400).json({ error: "Something want to wrong..." })
    }
};

exports.userDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.user_id;
        const data = await db.collection("users").doc(id).get();
        if (data.data() === undefined) {
            errors.push({ msg: "User data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        const userData = data.data();
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
        const userData = {
            user_firstname: data.firstName,
            user_lastname: data.lastName,
            user_phone_number: data.phoneNumber,
            user_email: data.email,
            user_password: data.password,
            user_profile: data.url,
            created_at: new Date(),
        };

        const updateUser = await db.collection("users").doc(id);
        await updateUser.update(userData);
        const ud = await updateUser.get();
        const updatedData = ud.data()
        return res.status(200).json({ userData: updatedData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }
};

exports.userRemove = async (req, res) => {
    try {
        const id = req.params.user_id;
        const data = await db.collection("users").doc(id);
        await data.update({ is_deleted: true });
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
            book_givendate: new Date(),
            book_recevieddate: x
        }
        const userData = await db.collection("users").doc(uid);
        const ud = await userData.get();
        const updatedData = ud.data();
        // console.log(updatedData.user_havebook,"get all data")
        const ub = updatedData.user_havebook
        ub.push(bookAdd)
        await userData.update({
            user_havebook: ub
        });
        return res.status(200).json({ bookData: bookData, userData: updatedData })
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
        ub.forEach((doc)=>{
            if(doc.book_id === bid){
                remainingBook.push(doc)
            }
        })
        await userData.update({
            user_havebook:remainingBook
        })
        return res.status(200).json({ bookData: bookData, userData:userData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}