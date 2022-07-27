// for checking empty string or not
const isEmpty = (string) => {
    if (string.trim() === "") {
        return true;
    }
    return false;
};

// Validating User data
exports.validateRoleData = (data) => {
    let errors = [];
    if (isEmpty(data.roleName)) {
        errors.push({ msg: "Role name is required" });
    }
    if (isEmpty(data.lastName)) {
        errors.push({ msg: "Display name is required" });
    }

    return {
        errors,
        valid: errors.length === 0 ? true : false,
    };
};
