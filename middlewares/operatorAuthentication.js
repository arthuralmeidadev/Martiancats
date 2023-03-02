import { errors } from "../config/errors.config.js";

async function operatorAuthentication(req, res, next) {
    try {
        if (!res.locals.isOperator)
            throw errors.InsuffPerm;
            
        next();
    } catch (err) {
        next(err);
    };
};

export default operatorAuthentication;