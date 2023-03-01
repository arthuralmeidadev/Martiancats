const database = require("../models/initialization");
const Customer = database.customer;

async function createCustomer(email, rep) {
    try {
        Customer.create({
            email: email,
            secret: placeHolder,
            rep: rep ?? "unspescified",
            accountOptions: {}
        });
    } catch (err) {
        return;
    };
};

async function isRegisteredCustomer(email) {
    try {
        const customer = Customer.findOne({ where: { email: email } });
        if (customer)
            return true;

        return false;
    } catch (err) {
        return null;
    };
};

async function fetchCustomer(email) {
    try {
        return Customer.findOne({ where: { email: email } });
    } catch (err) {
        return null;
    };
};

async function isValidCustomer(customer, secret) {
    return customer.secret === secret;
};

module.exports = {
    createCustomer,
    isRegisteredCustomer,
    fetchCustomer,
    isValidCustomer
};