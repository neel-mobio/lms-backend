// const { db, firebaseSecondaryApp } = require("../../config/admin")
const router = require("express");
const db = require('../../models/index');
const UserLogin = db.UserLogin;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = router.Router();
require("dotenv").config();


const { registerValidation } = require('./validation');


// exports.signIn = async (req, res) => {
//   try {
//     const user = req.body
//     // const user = {
//     //   email: req.body.email,
//     //   password: req.body.password,
//     // };
//     const { valid, errors } = validateSignInData(user)

//     if (!valid) {
//       return res.status(400).json(errors);
//     }

//     let userEmail = null;
//     const usersData = await db.collection("users").where("user_type", "==", "admin").get();
//     usersData.forEach((doc) => {
//       if (doc.data().user_email == user.email) {
//         // console.log(doc.data().user_type,"////////")
//         const userType = doc.data().user_type
//         userEmail = doc.data().user_email;
//         res.cookie('userType', userType, {
//           maxAge: 24 * 60 * 60 * 1000,
//           httpOnly: true,
//         });
//       }
//       console.log(userEmail, "mail")
//     });

//     if (user.email == userEmail) {
//       const data = await firebaseSecondaryApp
//         .auth()
//         .signInWithEmailAndPassword(user.email, user.password);
//       const token = await data.user.getIdToken();
//       res.cookie('_userid', token, {
//         maxAge: 24 * 60 * 60 * 1000,
//         httpOnly: true,
//       });
//       return res.status(200).json({ token: token })
//     } else {
//       // console.log("error2")
//       const errors = "Wrong credentials"
//       return res.status(401).send(errors);
//     }
//   } catch (error) {
//     if (error.code == "auth/invalid-email") {
//       // console.log("error3")
//       return res.status(403).json("Please enter the valid email ID");
//     }
//     if (
//       error.code == "auth/wrong-password" ||
//       error.code == "auth/user-not-found"
//     ) {
//       // console.log("error4")
//       return res.status(403).json({ message: "Wrong credentials, Please try again" });
//     }
//     // console.log("error5")
//     return res.status(500).json({ error: error.code });
//   }
// };

// exports.signOut = async (req, res) => {
//   try {
//     await firebaseSecondaryApp.auth().signOut();
//     res.clearCookie('_userid');
//     res.clearCookie('userType');
//     return res.status(200).json("logout Successfull...")
//   } catch (error) {
//     console.log(error);
//   }
// }


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
  const { error } = registerValidation(req.body);
  // throw validation errors
  if (error) return res.status(400).json({ error: error.details[0].message });
  const user = await UserLogin.findOne({ email: req.body.email });
  // throw error when email is wrong
  if (!user) return res.status(400).json({ error: "Email is wrong" });
  // check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
      return res.status(400).json({ error: "Password is wrong" });
  // create token
  const token = jwt.sign(
      // payload data
      {
          name: user.name,
          id: user._id,
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
