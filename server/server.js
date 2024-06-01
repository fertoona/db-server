const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');

const initDbCredentials = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    multipleStatements: true,
}
const dbCredentials = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    database: 'mobil_operator'
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')))

function initDb() {
    return new Promise(async (resolve, reject) => {
        const connection = mysql.createConnection(initDbCredentials);

        const initDbSql = fs.readFileSync(path.join(__dirname, '/sql/init.sql'), {encoding: 'utf-8'});

        connection.connect();

        await connection.query(initDbSql, (error) => {
            if (error) {
                reject(error);
            }
        });

        connection.end();

        resolve(true);
    });
}

function getModels(table) {
    return new Promise(async (resolve) => {
        const connection = mysql.createConnection(dbCredentials);

        connection.connect();

        const sql = `select * from ${table} order by id desc;`;

        await connection.query(sql, (error, rows) => {
            connection.end();

            if (error) {
                resolve([false, error.sqlMessage]);
            }

            resolve([JSON.parse(JSON.stringify(rows)), null]);
        });
    });
}

function createModel(table, data) {
    return new Promise(async (resolve) => {
        const connection = mysql.createConnection(dbCredentials);

        connection.connect();

        const fields = Object.keys(data);
        const values = Object.values(data).map((el) => {
            if (typeof el === 'string') {
                return `'${el}'`;
            }

            return el;
        });

        const sql = `insert into ${table} (${fields.join(', ')}) values (${values.join(', ')});`;

        await connection.query(sql, (error) => {
            connection.end();

            if (error) {
                resolve([false, error.sqlMessage]);
            }

            resolve([true, null]);
        });
    });
}

function deleteModel(table, id) {
    return new Promise(async (resolve) => {
        const connection = mysql.createConnection(dbCredentials);

        connection.connect();

        const sql = `delete from ${table} where id = ${id};`;

        await connection.query(sql, (error) => {
            connection.end();

            if (error) {
                resolve([false, error.sqlMessage]);
            }

            resolve([true, null]);
        });
    });
}

function createApiRoute(route, table) {
    app.route('/api' + route)
        .get(async (req, res) => {
            const [data, message] = await getModels(table);

            if (data) {
                return res.status(200).json({data});
            }

            return res.status(400).json({message})
        })
        .post(async (req, res) => {
            const {body} = req;

            const [status, message] = await createModel(table, body);

            if (status) {
                return res.status(201).json({message: 'created'});
            }

            return res.status(422).json({message});
        })
        .delete(async (req, res) => {
            const {id} = req.query;

            const [status, message] = await deleteModel(table, id);

            if (status) {
                return res.status(200).json({message: `${id} deleted`});
            }

            return res.status(422).json({message});
        });
}

createApiRoute('/customers', 'customers');
createApiRoute('/tariffs', 'tariffs');
createApiRoute('/options', 'options');
createApiRoute('/calls', 'calls');
createApiRoute('/tariffs/options', 'tariff_options');

initDb()
    .then(() => {
        app.listen(8080, () => {
            console.log('app started on 8080 port');
        });
    })
    .catch((error) => {
        console.log('app not started, db was not initialized');
        console.log(error.sqlMessage);
    })
