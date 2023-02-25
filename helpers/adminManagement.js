const database = require("../models/initialization");
const Admin = database.admin;

async function fetchAdmin(id) {
    return Admin.findOne({ where: { id: id } });
};

async function getAdminRoles(admin) {
    admin.getRoles();
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