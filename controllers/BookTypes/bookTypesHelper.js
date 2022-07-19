// for checking empty string or not
const isEmpty = (string) => {
    if (string.trim() === "") {
        return true;
    }
    return false;
};

exports.validateBookTypeData = (data) => {
    let errors = [];
    if (isEmpty(data.bookType)) {
        errors.push({ msg: "Book Type is required" });
    }
    return {
        errors,
        valid: errors.length === 0 ? true : false,
    };
}