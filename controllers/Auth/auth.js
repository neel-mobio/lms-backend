const { db, firebaseSecondaryApp } = require("../../config/admin")


const { validateSignInData } = require('./authHelper');


exports.signIn = async (req, res) => {
  try {
    const user = req.body
    // const user = {
    //   email: req.body.email,
    //   password: req.body.password,
    // };
    const { valid, errors } = validateSignInData(user)

    if (!valid) {
      return res.status(400).json(errors);
    }

    let userEmail = null;
    const usersData = await db.collection("users").where("user_type", "==", "admin").get();
    usersData.forEach((doc) => {
      if (doc.data().user_email == user.email) {
        // console.log(doc.data().user_type,"////////")
        const userType = doc.data().user_type
        userEmail = doc.data().user_email;
        res.cookie('userType', userType, {
          maxAge: 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
      }
      console.log(userEmail, "mail")
    });

    if (user.email == userEmail) {
      const data = await firebaseSecondaryApp
        .auth()
        .signInWithEmailAndPassword(user.email, user.password);
      const token = await data.user.getIdToken();
      res.cookie('_userid', token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(200).json({ token: token })
    } else {
      // console.log("error2")
      const errors = "Wrong credentials"
      return res.status(401).send(errors);
    }
  } catch (error) {
    if (error.code == "auth/invalid-email") {
      // console.log("error3")
      return res.status(403).json("Please enter the valid email ID");
    }
    if (
      error.code == "auth/wrong-password" ||
      error.code == "auth/user-not-found"
    ) {
      // console.log("error4")
      return res.status(403).json({ message: "Wrong credentials, Please try again" });
    }
    // console.log("error5")
    return res.status(500).json({ error: error.code });
  }
};

exports.signOut = async (req, res) => {
  try {
    await firebaseSecondaryApp.auth().signOut();
    res.clearCookie('_userid');
    res.clearCookie('userType');
    return res.status(200).json("logout Successfull...")
  } catch (error) {
    console.log(error);
  }
}