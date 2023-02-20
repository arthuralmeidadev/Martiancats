//OLD

const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tester",
    database: "database_test"
});

module.exports = connection;