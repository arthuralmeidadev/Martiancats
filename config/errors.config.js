const ICVC = Error("Invalid Customer Validation Code");
const ICGE = Error("Invalid Customer General Error");
const ICTK = Error("Invalid Customer Or Token");
const FTRC = Error("Failed to Register Client");
const InsuffPerm = Error("Insufficient Permissions");

// General Common Errors
const BadRequest = Error("Bad request");
const Unauthorized = Error("Unauthorized");
const Forbidden = Error("Forbidden");
const NotFound = Error("Not found");
const InternalServerError = Error("Internal Server Error");
const Conflict = Error("Conflict");

ICVC.code = 40402;
ICGE.code = 40101;
ICTK.code = 40102;
FTRC.code = 50001;
InsuffPerm.code = 40301;

BadRequest.code = 400;
Unauthorized.code = 401;
Forbidden.code = 403
NotFound.code = 404;
Conflict.code = 409
InternalServerError.code = 500;

module.exports = {
    ICVC,
    ICGE,
    ICTK,
    FTRC,
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    Conflict,
    InternalServerError,
    InsuffPerm
};