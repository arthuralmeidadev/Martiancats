import database from "../config/dbInitialization.config.js";
import { errors } from "../config/errors.config.js";
const Admin = database.admin;

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

async function checkAdminCredentials(ID, Birthdate, Secret) {
    try {
        const { brithdate, secret } = await Admin.findOne({ where: { id: ID } });
        const isValidAdmin = brithdate === Birthdate && secret === Secret;

        if (!isValidAdmin)
            throw errors.Unauthorized;

    } catch (err) {
        throw errors.Unauthorized;;
    };
    
};
export default {
    fetchAdmin,
    getRole,
    checkAdminCredentials
};