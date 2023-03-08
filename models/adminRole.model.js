function adminRoleModel(sequelize, dataTypes) {
    const Role = sequelize.define("roles", {
        id: { type: dataTypes.INTEGER, primaryKey: true },
        name: { type: dataTypes.STRING }
    });
    return Role;
};

export default adminRoleModel;