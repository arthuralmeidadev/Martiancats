async function viewDashboard(req, res, next) {
    try {
        return res.status(200).json({ message: "This is the standard admin dashboard" })
    } catch (err) {
        next(err);
    };
};

async function viewOperatorDashboard(req, res, next) {
    try {
        return res.status(200).json({ message: "This is the operator dashboard" });
    } catch (err) {
        next(err);
    };
};

module.exports = {
    viewDashboard,
    viewOperatorDashboard
};