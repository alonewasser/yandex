const mysql = require('mysql');
const http = require("http");
const { getReqData } = require("./utils");
const Controller = require('./controller');

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {

    //Получение списка user (+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++)
    if (req.url === "/api/user" && req.method === "GET") {
        const mysql = require('mysql');
        var connection = mysql.createConnection({
            port: "3306",
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'auction',
        });
        let queryString = 'SELECT * FROM user';
        connection.connect(function (err) {
            if (err) {
                return console.error("Ошибка: " + err.auction);
            }
            else {
                console.log("Подключение к серверу MySQL успешно установлено");
            }
        });
        connection.query(queryString,
            function (err, results, fields, resolve) {
                console.log(err);
                console.log(results);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
            });

        connection.end(function (err) {
            if (err) {
                console.error("Ошибка: " + err.message);
            }
            else {
                console.log("Соединение закрыто");
            }
        });
    }


    //Добавление данных в таблицу user (++++++++++)
    else if (req.url === "/api/user" && req.method === "POST") {
        try {
            let user_data = await getReqData(req);
            const user = JSON.parse(user_data);
            await new Controller().CreateUser(user.FirstName, user.LastName, user.login, user.password);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: 'Account created' }));
        } catch (error) {
            if (error.login !== undefined) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error }));
            }
        }
    }
    //Удалить данные в таблице lot
    else if (req.url === "/lot" && req.method === "DELETE") {
    const id_lot = req.url.split('/')[3];
    const lot = await getReqData(req);
    const idlot = JSON.parse(lot);
    console.log(id_lot);
    await (new Controller().deletelot(id_lot));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id_lot: 'Lot deleted' }));
    }
    

    // login (Авторизация) POST (++++++++++++++++++++++++)
    else if (req.url === "/login" && req.method === "POST") {
        try {
            let user_data = await getReqData(req);
            const user = JSON.parse(user_data);
            let LoginUser = await new Controller().LoginUser(user.login, user.password);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ token: LoginUser }));
        } catch (error) {
            console.log(error);
        }
    }
    //Добавление данных в таблицу lot (++++++++++++++++++)
    else if (req.url === "/api/lot" && req.method === "POST") {
        const lot_data = await getReqData(req);
        const lot = JSON.parse(lot_data);
        const newlot = await new Controller().Createlot(lot.id_lot, lot.id_user, lot.description, lot.title, lot.date);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ id: newlot }));
    }

//Получить максимальную сумму из таблицы stavka
if (req.url === "/api/stavka" && req.method === "GET") {
    const mysql = require('mysql');
    var connection = mysql.createConnection({
    port :"3306",
    host : '127.0.0.1',
    user : 'root',
    password: 'root',
    database: 'auction',
    
    });

    let queryString='select * from stavka where price in (select max(price) from stavka)';
    connection.connect(function(err){
    if (err) {
    return console.error("Ошибка: " + err.auction);
    }
    else{
    console.log("Подключение к серверу MySQL успешно установлено");
    }
    });
    
    connection.query(queryString,
    function(err, results, fields, resolve) {
    console.log(err);
    console.log(results);
    
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(results));
    });
    
    connection.end(function(err){
    if (err) {
    console.error("Ошибка: " + err.message);
    }
    else{
    console.log("Соединение закрыто");
    }
    });
    }

        //Добавление данных в таблицу stavka (++++++++++)
        else if (req.url === "/api/stavka" && req.method === "POST") {
            try {
                let stavka_data = await getReqData(req);
                const stavka = JSON.parse(stavka_data);
                await new Controller().Createstavka(stavka.id_stavka, stavka.id_lot, stavka.id_user, stavka.price, stavka.date);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: 'Stavka created' }));
            console.log("hfg");
            } catch (error) {
                if (error.login !== undefined) {
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error }));
                }
            }
        }
    //LOGOUT (+++++++++++++++++++++++)
    else if (req.url === "/api/logout" && req.method === "GET") {
        const body = await getReqData(req);
        const users = JSON.parse(body);
        await new Controller().logout(user.token);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "logout" }));
    }

    // No route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        //res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});