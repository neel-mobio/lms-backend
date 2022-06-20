// for checking empty string or not
const isEmpty = (string) => {
    if (string.trim() === "") {
      return true;
    }
    {
      return false;
    }
  };
  
  // for checking input value is numeric or not
  const isNumeric = (string) => {
    var numbers = /^[0-9]+$/;
    if (string.match(numbers)) {
      return true;
    } else {
      return false;
    }
  };
  
  // Validating Admin data
  exports.validateUserData = (data) => {
    let errors = [];
    if (isEmpty(data.user_firstname)) {
      errors.push({ msg: "First name is required" });
    }
    if (isEmpty(data.user_lastname)) {
      errors.push({ msg: "Last name is required" });
    }
    if (isEmpty(data.user_phone_number)) {
      errors.push({ msg: "Phone is required" });
    }
    if (isEmpty(data.user_email)) {
      errors.push({ msg: "Email is required" });
    }
    if (isEmpty(data.user_password)) {
      errors.push({ msg: "Password is required" });
    }
  
    if (data.user_phone_number.length !== 10) {
      errors.push({ msg: "Phone number should be exact 10 digits" });
    }
    if (data.user_password.length < 6) {
      errors.push({ msg: "The password should be at least 6 character long" });
    }
    if (!isNumeric(data.user_phone_number)) {
      errors.push({ msg: "Phone number should be numbers only." });
    }
  
    return {
      errors,
      valid: errors.length === 0 ? true : false,
    };
  };
  