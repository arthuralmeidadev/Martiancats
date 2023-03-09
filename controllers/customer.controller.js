async function viewAll(req, res, next) {
    try {
        return res.render("../views/customer/homepage");
    } catch (err) {
        next(err);
    };
};

async function viewAccount(req, res, next) {
    try {
        
    } catch (err) {
        next(err);
    };
};

async function viewProjects(req, res, next) {
    try {
        
    } catch (err) {
        next(err);
    };
};

export default {
    viewAll,
    viewAccount,
    viewProjects
};