// for checking empty string or not
const isEmpty = (string) => {
    if (string.trim() === "") {
        return true;
    }
    return false;
};

exports.validateEditorData = (data) => {
    let errors = [];
    if (isEmpty(data.editorName)) {
        errors.push({ msg: "Editor name is required" });
    }
   
    return {
        errors,
        valid: errors.length === 0 ? true : false,
    };
}