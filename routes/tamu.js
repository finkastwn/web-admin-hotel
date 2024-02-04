var express = require('express');
var router = express.Router();
var connection = require('../library/database');

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM tamu ORDER BY id_tamu asc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('tamu', {
                data: ''
            });
        } else {
            res.render('tamu/index', {
                data: rows
            });
        }
    });
});

router.get('/detail/(:id_tamu)', function (req, res, next) {
    let id_tamu = req.params.id_tamu;

    connection.query('SELECT * FROM tamu where id_tamu = ?', [id_tamu], function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.redirect('/tamu')
        } else {
            res.render('tamu/detail', {
                data: rows
            });
        }
    });
});

module.exports = router