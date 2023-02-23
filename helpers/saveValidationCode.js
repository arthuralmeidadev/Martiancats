const cachePath = "./cache/emailValidationCodes.json";

async function saveCode(code, expiry) {
    const validationCodes = await fs.readJson(cachePath);
    validationCodes.push({ code: code, expiry: expiry });
    await fs.writeJson(cachePath, validationCodes, { spaces: 2 });
};

module.exports = saveCode;