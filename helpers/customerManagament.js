const database = require("../models/initialization");
const Customer = database.customer;
const errors = require("../config/errors.config");

async function createCustomer(email, rep) {
    try {
        await Customer.findOrCreate({
            where: { email: email },
            defaults: {
                email: email,
                secret: placeHolder,
                rep: rep,
                accountOptions: {}
            }
        });
    } catch (err) {
        throw errors.FTRC;
    };
};

async function isRegisteredCustomer(email) {
    try {
        const customer = await Customer.findOne({ where: { email: email } });
        if (customer)
            return true;

        return false;
    } catch (err) {
        return null;
    };
};

async function fetchCustomer(email) {
    try {
        return await Customer.findOne({ where: { email: email } });
    } catch (err) {
        return null;
    };
};

async function isValidCustomer(email, secret) {
    const customer = await Customer.findOne({ where: { email: email } });
    return customer.secret === secret;
};

module.exports = {
    createCustomer,
    isRegisteredCustomer,
    fetchCustomer,
    isValidCustomer
};