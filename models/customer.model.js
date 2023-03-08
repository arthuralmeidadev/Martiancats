function customerModel(sequelize, dataTypes) {
    const Customer = sequelize.define("customer", {
        email: { type: dataTypes.STRING, primaryKey: true },
        secret: { type: dataTypes.STRING },
        rep: { type: dataTypes.STRING },
        accountOptions: { type: dataTypes.JSON },
    });
    return Customer;
};

export default customerModel;