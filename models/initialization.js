const config = require("../config/database.config");

const database = {};

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        logging: 0, // false

        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: 0, // false

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

database.Sequelize = Sequelize;
database.sequelize = sequelize;

database.admin = require("./adminUser.model.js")(sequelize, Sequelize);
database.role = require("./adminRole.model.js")(sequelize, Sequelize);

database.role.belongsToMany(database.admin, {
    through: "admin_roles",
    foreignKey: "roleId",
    otherKey: "adminId"
});

database.admin.belongsToMany(database.role, {
    through: "admin_roles",
    foreignKey: "adminId",
    otherKey: "roleId"
});

database.ROLES = ["assistant", "operator"];

module.exports = database;