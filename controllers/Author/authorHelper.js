// for checking empty string or not
const isEmpty = (string) => {
    if (string.trim() === "") {
        return true;
    }
    return false;
};

exports.validateAuthorData = (data) => {
    let errors = [];
    if (isEmpty(data.firstName)) {
        errors.push({ msg: "Author first name is required" });
    }
    if (isEmpty(data.lastName)) {
        errors.push({ msg: "Author last name is required" });
    }
    return {
        errors,
        valid: errors.length === 0 ? true : false,
    };
}