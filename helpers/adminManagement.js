const database = require("../models/initialization");
const Admin = database.admin;

async function fetchAdmin(id) {
    try {
        return await Admin.findOne({ where: { id: id } });
    } catch (err) {
        return null;
    };
};

async function getAdminRoles(admin) {
    try {
        return await admin.getRoles();
    } catch (err) {
        return null;
    };
};

async function isValidAdmin(admin, birthdate, secret) {
    const isValidAdmin = admin.birthdate === birthdate && admin.secret === secret;
    return isValidAdmin;
};
module.exports = {
    fetchAdmin,
    getAdminRoles,
    isValidAdmin
};