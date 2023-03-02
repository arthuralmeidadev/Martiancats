import customerManagement from "../helpers/customerManagament.js";
import { errors } from "../config/errors.config.js";

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

export default customerRegistrationMiddleware;