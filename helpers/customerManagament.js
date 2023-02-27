const database = require("../models/initialization");
const Customer = database.customer;

async function createCustomer(email, rep) {
    try {
        Customer.create({
            email: email,
            secret: placeHolder,
            rep: rep,
            accountOptions: {}
        });
    } catch (err) {
        return;
    };
};

async function isRegisteredCustomer(email) {
    try {
        const customer = await Customer.findOne({ where: { email: email } });
        if (customer) {
            return true;
        } else {
            return false;
        };
    } catch (err) {
        return null;
    };
};

module.exports = {
    createCustomer,
    isRegisteredCustomer
};