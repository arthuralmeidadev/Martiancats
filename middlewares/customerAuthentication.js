import tokenizer from "../helpers/tokenizer.js";
import { errors } from "../config/errors.config.js";

async function customerAuthenticationMiddleware (req, res, next) {
    try {
        const { accessToken } = req.cookies;

        if (!accessToken)
           throw errors.Forbidden;

        await tokenizer.verifyAccessToken(accessToken);

        next();
    } catch (err) {
         return res.redirect("/refresh");
    };
};

export default customerAuthenticationMiddleware;