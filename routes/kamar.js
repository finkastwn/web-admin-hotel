var express = require('express');
var router = express.Router();

var connection = require('../library/database');

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM kamar JOIN jenis_kamar ON kamar.id_jenis_kamar = jenis_kamar.id_jenis_kamar', function (err, rows) {
        if (err) throw err;

        res.render('kamar/index', {
            data: rows
        });
    });
});

module.exports = router;