// for checking empty string or not
const isEmpty = (string) => {
    if (string.trim() === "") {
        return true;
    }
    return false;
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

exports.validationLibraryData = (data) => {
    let errors = [];
    if (isEmpty(data.name)) {
        errors.push({ msg: "Book name is required" });
    }
    if (isEmpty(data.phoneNumber)) {
        errors.push({ msg: "Phone is required" });
    }
    if (data.phoneNumber.length !== 10) {
        errors.push({ msg: "Phone number should be exact 10 digits" });
    }
    if (!isNumeric(data.phoneNumber)) {
        console.log(data.phoneNumber, "from helper")
        errors.push({ msg: "Phone number should be numbers only." });
    }
    return {
        errors,
        valid: errors.length === 0 ? true : false,
    };
}