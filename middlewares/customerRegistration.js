const customerManagement = require("../helpers/customerManagament");
const errors = require("../config/errors.config");

async function customerRegistrationMiddleware (req, res, next) {
    try {
        const { signupIssuer } = req.body;
        const isRegistered = await customerManagement.isRegisteredCustomer(signupIssuer);

        if (isRegistered)
            throw errors.Conflict;
            
        next();
    } catch (err) {
        next(err);
    };
};

module.exports = customerRegistrationMiddleware;