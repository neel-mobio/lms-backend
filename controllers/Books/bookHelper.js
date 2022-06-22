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

exports.validateBookData = (data) => {
    let errors = [];
    if (isEmpty(data.name)) {
        errors.push({ msg: "Book name is required" });
    }
    if (isEmpty(data.auther)) {
        errors.push({ msg: "Auther name is required" });
    }
    if (isEmpty(data.discription)) {
        errors.push({ msg: "Discription is required" });
    }
    if (isEmpty(data.coverPage)) {
        errors.push({ msg: "Cover page is required" });
    }
    if (isEmpty(data.language)) {
        errors.push({ msg: "Language is required" });
    }
    if (isEmpty(data.category)) {
        errors.push({ msg: "Category is required" });
    }
    return {
        errors,
        valid: errors.length === 0 ? true : false,
    };
}