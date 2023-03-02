async function viewAll(req, res, next) {
    try {
        return res.render("../views/customer/homepage");
    } catch (error) {
        next(err);
    };
};

async function viewAccount(req, res, next) {
    try {
        
    } catch (error) {
        next(err);
    };
};

async function viewProjects(req, res, next) {
    try {
        
    } catch (error) {
        next(err);
    };
};

module.exports = {
    viewAll,
    viewAccount,
    viewProjects
};