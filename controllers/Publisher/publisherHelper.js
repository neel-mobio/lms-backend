// for checking empty string or not
const isEmpty = (string) => {
    if (string.trim() === "") {
        return true;
    }
    return false;
};

exports.validatePublisherData = (data) => {
    let errors = [];
    if (isEmpty(data.publisherName)) {
        errors.push({ msg: "Publisher name is required" });
    }
    return {
        errors,
        valid: errors.length === 0 ? true : false,
    };
}