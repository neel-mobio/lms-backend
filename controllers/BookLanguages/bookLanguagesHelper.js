// for checking empty string or not
const isEmpty = (string) => {
    if (string.trim() === "") {
        return true;
    }
    return false;
};

exports.validateBookLanguageData = (data) => {
    let errors = [];
    if (isEmpty(data.bookLanguage)) {
        errors.push({ msg: "Book Language is required" });
    }
    if (isEmpty(data.languageCode)) {
        errors.push({ msg: "Language code is required" });
    }
    return {
        errors,
        valid: errors.length === 0 ? true : false,
    };
}