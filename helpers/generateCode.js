const validationCodes = require("../cache/emailValidationCodes.json");
const diff = validationCodes.map(entry => entry.code);

function random() {
    return Math.floor(Math.random() * 10);
};

async function generateCode() {
    const code = `${random()}${random()}${random()}${random()}${random()}${random()}`;
    
    if (diff.includes(code)) {
        generateCode();
    } else {
        return code;
    };
};

module.exports = generateCode;