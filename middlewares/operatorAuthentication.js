const errors = require("../config/errors.config");

async function operatorAuthentication(req, res, next) {
    try {
        if (!res.locals.isOperator)
            throw errors.InsuffPerm;
            
        next();
    } catch (err) {
        next(err);
    };
};

module.exports = operatorAuthentication;