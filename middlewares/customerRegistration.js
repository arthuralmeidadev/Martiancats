const customerManagement = require("../helpers/customerManagament");

async function customerRegistrationMiddleware (req, res, next) {
    const { signupIssuer } = req.body;

    const isRegistered = await customerManagement.isRegisteredCustomer(signupIssuer);
    
    if (isRegistered) {
        return res.sendStatus(409);
    } else {
        next();
    };
};

module.exports = customerRegistrationMiddleware;