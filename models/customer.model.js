function customerModel(sequelize, Sequelize) {
    const Customer = sequelize.define("customer", {
        email: { type: Sequelize.STRING, primaryKey: true },
        secret: { type: Sequelize.STRING },
        rep: { type: Sequelize.STRING },
        accountOptions: { type: Sequelize.JSON },
    });
    return Customer;
};

export default customerModel;