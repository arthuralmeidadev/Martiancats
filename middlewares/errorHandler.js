async function errorHandler(error, req, res, next) {
    switch (error.code) {
        case 400:
            return res.sendStatus(400);
        case 401:
            return res.sendStatus(401);
        case 403:
            return res.sendStatus(403);
        case 404:
            return res.sendStatus(404);
        case 409:
            return res.sendStatus(409);
        case 500:
            return res.sendStatus(500);
        case 40101:
            return res.sendStatus(401);
        case 40102:
            res.clearCookie("accessToken");
            return res.sendStatus(403);
        default:
            return res.sendStatus(500);
    };
};

export default errorHandler;