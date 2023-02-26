async function viewDashboard(req, res) {
    return res.status(200).json({ message: "This is the standard admin dashboard" })
};

async function viewOperatorDashboard(req, res) {
    return res.status(200).json({ message: "This is the operator dashboard" });
};

module.exports = {
    viewDashboard,
    viewOperatorDashboard
};