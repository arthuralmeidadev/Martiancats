const responses = {
    default: (res) => {
        return res.sendStatus(500)
    },
    400: (res) => {
        return res.sendStatus(400)
    },
    401: (res) => {
        return res.sendStatus(401)
    },
    403: (res) => {
        return res.sendStatus(403)
    },
    404: (res) => {
        return res.sendStatus(404)
    },
    409: (res) => {
        return res.sendStatus(409)
    },
    500: (res) => {
        return res.sendStatus(500)
    },
    40101: (res) => {
        return res.sendStatus(401)
    },
    40102: (res) => {
        res.clearCookie("accessToken");
        return res.sendStatus(403)
    },
};

async function errorHandler(error, req, res, next) {
    (responses[error.code] || responses["default"])(res);
};

module.exports = errorHandler;