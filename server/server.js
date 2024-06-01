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
// Добавляю index.html и все связанные с ним файлы в статику приложения
// (при запросе на localhost:8080/ вернет index.html)
app.use(express.static(path.join(__dirname, '/public')))

// Инициализация базы данных
function initDb() {
    // Возвращаю true, если база создалась (resolve) и error в случае ошибки (reject)
    return new Promise(async (resolve, reject) => {
        const connection = mysql.createConnection(initDbCredentials);

        // С помощью пакетов fs и path находим файл init.sql и записываем его содержимое в текстовом виде в переменную
        const initDbSql = fs.readFileSync(path.join(__dirname, '/sql/init.sql'), {encoding: 'utf-8'});

        connection.connect();

        // Создаем базу данных по запросам, указанным в дампе бд (init.sql)
        await connection.query(initDbSql, (error) => {
            if (error) {
                reject(error);
            }
        });

        connection.end();

        resolve(true);
    });
}

// Запрос всех записей из таблицы
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

// Создание новое записи в таблице
function createModel(table, data) {
    return new Promise(async (resolve) => {
        const connection = mysql.createConnection(dbCredentials);

        connection.connect();

        // Забираю ключи из объекта
        const fields = Object.keys(data);
        // Также, значения. Если el === string, оборачиваю его в кавычки ('), чтобы sql понял, что это строка
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

// Удаление записи из таблицы по id
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

// Создаю для каждого эндпоинта обработчики
function createApiRoute(route, table) {
    app.route('/api' + route)
        // обработчик GET запросов на /api/{route}
        .get(async (req, res) => {
            const [data, message] = await getModels(table);

            if (data) {
                // 200 - OK
                return res.status(200).json({data});
            }

            // 400 - BAD REQUEST
            return res.status(400).json({message})
        })
        // Обработчик POST запросов
        .post(async (req, res) => {
            // То же, что и const body = req.body, забираю данные формы из запроса
            const {body} = req;

            const [status, message] = await createModel(table, body);

            if (status) {
                // 201 - CREATED
                return res.status(201).json({message: 'created'});
            }

            // 422 - UNPROCESSABLE ENTITY
            return res.status(422).json({message});
        })
        // Обработчик DELETE запросов
        .delete(async (req, res) => {
            // Параметр id из строки запроса. Пример: (www.ex.ru/test?id=1)
            const {id} = req.query;

            const [status, message] = await deleteModel(table, id);

            if (status) {
                // 200 - OK
                return res.status(200).json({message: `${id} deleted`});
            }

            // 422 - UNPROCESSABLE ENTITY
            return res.status(422).json({message});
        });
}

// Создаю обработчики для таблицы customers по эндпоинту '/api/customers
createApiRoute('/customers', 'customers');
createApiRoute('/tariffs', 'tariffs');
createApiRoute('/options', 'options');
createApiRoute('/calls', 'calls');
createApiRoute('/tariffs/options', 'tariff_options');

// Инициализируем базу данных. Если создана / создалась - запускаем сервер, если нет - выдаем ошибку в консоль
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
