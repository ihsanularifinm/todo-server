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

app.listen(server.port, () =>
    console.log(`Server started, listening port: ${server.port}`)
);
