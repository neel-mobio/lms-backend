// for checking empty string or not
const isEmpty = (string) => {
    if (string.trim() === "") {
        return true;
    }
    return false;
};

exports.validateWriterData = (data) => {
    let errors = [];
    if (isEmpty(data.firstName)) {
        errors.push({ msg: "Writer first name is required" });
    }
    if (isEmpty(data.lastName)) {
        errors.push({ msg: "Writer last name is required" });
    }
    return {
        errors,
        valid: errors.length === 0 ? true : false,
    };
}