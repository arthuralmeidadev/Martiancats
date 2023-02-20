async function dashboard(req, res) {
    return res.status(200).json({ message: "This is the standard admin dashboard" })
};

async function operatorDashboard(req, res) {
    return res.status(200).json({ message: "This is the operator dashboard" });
};

module.exports = {
    dashboard,
    operatorDashboard
};