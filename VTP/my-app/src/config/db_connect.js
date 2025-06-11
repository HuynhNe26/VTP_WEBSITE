const mysql = require('mysql2'); //npm install mysql2

const db = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'vtp',
    port : 3306
})

module.exports = db.promise();