// OLD

const connection = require('../.bin/database');
const logger = require('../utils/logger');

async function getCustomer(req, res) {
    var idArray = req.params.ids;
    var values = JSON.stringify(idArray.split(';')).slice(1, -1);
    var query = `SELECT * FROM customers WHERE ID IN(${values});`;

    connection.query(query, (err, result) => {      
        if (err) {
            logger.error(`Database connection failure for: ${err}`);
            return res.status(400).json({error: `DATABASE CONNECTION FAILURE: ${err}`});
        } else {
            logger.success('Headers sent to client.');
            return res.status(200).send(result);
        };
    });
};

async function updateCustomer(req, res) {
    var expression = req.params.expression;
    var command = expression.slice(expression.indexOf('['), expression.indexOf(']')+1);
    var id = expression.replace(command, '');
    var contents = command.slice(1, -1).split(',');
    var new_values = '';

    for (i in contents) {
        new_values += `${contents[i].split('=')[0]} = \'${contents[i].split('=')[1]}\', `;
    };
    var new_values = new_values.slice(0, -2);
    var query = `UPDATE customers SET ${new_values} WHERE ID = ${id};`;     

    connection.query(query, (err, result) => {
        if (err) {
            logger.error(`Database connection failure for: ${err}`);
            return res.status(400).json({error: `DATABASE CONNECTION FAILURE: ${err}`});
        };

        const query = `SELECT * FROM customers WHERE ID = ${id};`;
        connection.query(query, (err, result) => {
            if (err) {
                logger.error(err);
            };
            logger.success('Headers sent to client.');
            return res.status(200).send(result);
        });
    });
};

module.exports = {
    getCustomer,
    updateCustomer
};