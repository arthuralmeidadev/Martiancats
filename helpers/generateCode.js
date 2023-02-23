function random() {
    return Math.floor(Math.random() * 10);
};

async function generateCode(diff) {
    const code = `${random()}${random()}${random()}${random()}${random()}${random()}`;
    
    if (diff.includes(code)) {
        generateCode(diff);
    } else {
        return code;
    };
};

module.exports = generateCode;