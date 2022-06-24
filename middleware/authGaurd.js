const { firebase } = require("../config/admin");

// const multer = require("multer");

exports.isAuthenticated = (req, res, next) => {
  const currentUser = firebase.auth().currentUser;
  console.log(currentUser,"geting current user///////")
  if (currentUser != null) {
    next();
  } else {
    req.flash("error_msg", "You are not authenticated...!!");
    res.redirect("/");
  }

  // res.render("Pages/pages-unauthorized");
  //   console.log("You are not authenticated...!!");
};
