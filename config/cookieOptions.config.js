const cookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 2 * 60 * 1000
};

module.exports = cookieOptions;