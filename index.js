const express = require('express'),
    cors = require('cors'),
    app = express(),
    db = require('./connection/db.js');

app.use(express.json());
app.use(cors());
app.use(
    express.urlencoded({
        extended: true,
    })
);

var server = {
    port: 3080,
};

app.get('/', (req, res) => {
    res.send(`
    <html>
        <body>
            <form action="/todo" method="post">
            <input name="deskripsi" />
            <button> Add </button>
            </form>
        </body>
    </html>`);
});

app.get('/todo', (req, res) => {
    let sql = `SELECT * FROM todolist`;
    db.query(sql, (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

app.post('/todo', (req, res) => {
    let sql = `INSERT INTO todolist(deskripsi) VALUES (?)`;
    let values = [req.body.deskripsi];
    db.query(sql, [values], function (err) {
        if (err) throw err;
        res.send(res.insertId);
    });
});

app.delete('/todo/:id', function (req, res) {
    console.log(req.params.id);
    let sql = `DELETE FROM todolist WHERE id=(?)`;
    let values = [req.params.id];
    db.query(sql, [values], function (err) {
        if (err) throw err;
        res.end();
    });
});

app.post('/user', (req, res) => {
    let sql = `INSERT INTO users(username,password) VALUES (?)`;
    let values = [req.body.username, req.body.password];
    if (req.body.username.length && req.body.password.length === 0)
        res.end(500);
    db.query(sql, [values], (error, results, fields) => {
        if (error) throw error;
        res.json({ id: results.insertId });
    });
});

app.get('/user', (req, res) => {
    let sql = `SELECT * FROM users`;
    db.query(sql, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

app.delete('/user/:id', (req, res) => {
    let sql = `DELETE FROM users WHERE id=(?)`;
    let values = [req.params.id];

    db.query(sql, values, (error, results, fields) => {
        if (error) throw error;
        res.json({ pesan: 'terhapus' });
    });
});

app.listen(server.port, () =>
    console.log(`Server started, listening port: ${server.port}`)
);
