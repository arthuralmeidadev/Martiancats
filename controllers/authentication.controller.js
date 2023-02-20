// OLD

const jwt = require('jsonwebtoken');
const credentials = require('../data/credentials.json');
const logger = require('../utils/logger');

async function grabTokens(req, res) {
    if (req.body.username === credentials.dev.username &&
        req.body.secret === credentials.dev.secret) {

        const accessToken = jwt.sign(
            { name: req.body.username, secret: req.body.secret },
            credentials.dev.secret,
            { expiresIn: "3m" }
            );
        const refreshToken = jwt.sign(
            { username: credentials.dev.username },
            credentials.dev.refreshToken,
            { expiresIn: "1d" }
            );

        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true ,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.sendStatus(200);

    } else {
        logger.error('Invalid credentials.');
        return res.sendStatus(401);
    };
};

async function getNewAccessToken(req, res) {
    if (req.cookies?.refreshToken) {
        const refreshToken = req.cookies.refreshToken;

        jwt.verify(refreshToken, credentials.dev.refreshToken, (err, decoded) => {
            if (err) {
                logger.error('Refresh token invalid or expired.');
                return res.sendStatus(406);
            } else {
                const accessToken = jwt.sign(
                    { username: credentials.dev.username, secret: credentials.dev.username },
                    credentials.dev.secret,
                    { expiresIn: "3m" }
                    );
    
                res.clearCookie("accessToken");
                res.cookie("accessToken", accessToken, { httpOnly: true });
                return res.redirect('back');
            };
        });
    } else {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        logger.error('Invalid security tokens.');
        return res.sendStatus(401);
    };
};

module.exports = {
    grabTokens,
    getNewAccessToken
};

