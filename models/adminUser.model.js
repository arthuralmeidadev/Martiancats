function adminUserModel(sequelize, Sequelize) {
    const Admin = sequelize.define("admins", {
        id: { type: Sequelize.INTEGER, primaryKey: true },
        birthdate: { type: Sequelize.STRING },
        secret: { type: Sequelize.STRING }
    });
    return Admin;
};

module.exports = adminUserModel;