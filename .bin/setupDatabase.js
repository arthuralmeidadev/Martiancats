// to be used as callback during database sync

const database = require("../models/initialization");

const Role = database.role;
const Admin = database.admin;


function setupDataBase() {
    Role.create({
        id: 0,
        name: "assistant"
    });
    
    Role.create({
        id: 1,
        name: "operator"
    }).then(() => {
        Admin.create({
            id: "23869730",
            birthdate: "01/01/2023",
            secret: "secret"
        }).then(admin => {
            admin.setRoles(1);
        });
    });
};

module.exports = setupDataBase;