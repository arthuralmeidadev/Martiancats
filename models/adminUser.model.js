function adminUserModel(sequelize, dataTypes) {
    const Admin = sequelize.define("admins", {
        id: { type: dataTypes.INTEGER, primaryKey: true },
        birthdate: { type: dataTypes.STRING },
        secret: { type: dataTypes.STRING }
    });
    return Admin;
};

export default adminUserModel;