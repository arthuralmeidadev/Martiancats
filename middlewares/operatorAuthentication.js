async function operatorAuthentication(req, res, next) {
    if (!res.locals.isOperator) {
        return res.status(403).json({ message: "You are not an operator" });
    };

    next();
};

module.exports = operatorAuthentication;