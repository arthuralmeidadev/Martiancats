function random() {
    return Math.floor(Math.random() * 10);
};

async function generateValidationCode(diff) {
    const code = `${random()}${random()}${random()}${random()}${random()}${random()}`;
    if (diff.includes(code)) {
        generateValidationCode(diff);
    } else {
        return code;
    };
};

module.exports = generateValidationCode;