import { randomBytes } from "crypto";
import database from "../config/dbInitialization.config.js";
import { errors } from "../config/errors.config.js";
const Customer = database.customer;

async function createCustomer(email, rep) {
    try {
        const placeHolderPassword = randomBytes(4).toString("hex");
        const [customer, exists] = await Customer.findOrCreate({
            where: { email: email },

            defaults: {
                email: email,
                secret: placeHolderPassword,
                rep: rep,
                accountOptions: {}
            }
        });

        if (!exists)
            console.log("sending password through email: " + placeHolderPassword);
            return [placeHolderPassword];

    } catch (err) {
        throw errors.FTRC;
    };
};

async function isRegisteredCustomer(email) {
    try {
        const customer = await Customer.findOne({
            where: { email: email }
        });
        if (customer)
            return true;

        return false;
    } catch (err) {
        return null;
    };
};

async function fetchCustomer(email) {
    try {
        return await Customer.findOne({
            where: { email: email }
        });
    } catch (err) {
        return null;
    };
};

async function checkCustomerCredentials(email, secret) {
    try {
        const customer = await Customer.findOne({
            where: { email: email }
        });
        const isValidCustomer = customer.secret === secret;

        if (!isValidCustomer)
            throw errors.ICGE;      

    } catch (err) {
        throw errors.ICGE;
    };
};

export default {
    createCustomer,
    isRegisteredCustomer,
    fetchCustomer,
    checkCustomerCredentials
};