import { config } from "./database.config.js";
import Sequelize from "sequelize";
import adminRoleModel from "../models/adminRole.model.js";
import adminUserModel from "../models/adminUser.model.js";
import customerModel from "../models/customer.model.js";

const database = {};
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
database.admin = adminRoleModel(sequelize, Sequelize);
database.role = adminUserModel(sequelize, Sequelize);
database.customer = customerModel(sequelize, Sequelize);

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

export default database;