const database = require("../models/initialization");
const Admin = database.admin;
const errors = require("../config/errors.config");

async function fetchAdmin(id) {
    try {
        return await Admin.findOne({ where: { id: id } });
    } catch (err) {
        throw errors.Unauthorized;
    };
};

async function getRole(id) {
    try {
        const admin = await Admin.findOne({ where: { id: id } });
        const roles = await admin.getRoles();
        return roles[0]?.name;
    } catch (err) {
        return null;
    };
};

async function checkAdminCredentials(id, birthdate, secret) {
    try {
        const admin = await Admin.findOne({ where: { id: id } });
        const isValidAdmin = admin?.birthdate === birthdate && admin?.secret === secret;

        if (!isValidAdmin)
            throw errors.Unauthorized;

    } catch (err) {
        throw errors.Unauthorized;;
    };
    
};
module.exports = {
    fetchAdmin,
    getRole,
    checkAdminCredentials
};