async function customerAuthenticationMiddleware (req, res, next) {

    next();
};

module.exports = customerAuthenticationMiddleware;