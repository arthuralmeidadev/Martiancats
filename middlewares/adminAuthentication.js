import tokenizer from "../helpers/tokenizer.js";
import encrypter from "../helpers/encrypter.js";
import { errors } from "../config/errors.config.js";

async function adminAuthenticationMiddleware(req, res, next) {
    try {
        const { accessToken } = req.cookies;
        
        if (!accessToken)
            throw errors.Forbidden;

        await tokenizer.verifyAccessToken(accessToken);

        const decoded = await tokenizer.verifyAccessToken(accessToken);
        const payload = await encrypter.decrypt(decoded, "object");
        res.locals.isOperator = payload.role === "operator";

        next();
    } catch (err) {
        return res.redirect("admin/refresh");
    };
    
};

export default adminAuthenticationMiddleware;