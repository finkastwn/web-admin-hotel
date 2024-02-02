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

router.get('/create', function (req, res, next) {
    connection.query('select * from jenis_kamar', function (err, rows) {
        if (err) throw err;

        res.render('kamar/create', {
            idKamar: '',
            jenisKamar: rows,
            statusKamar: '',
        });
    });
});

router.post('/store', function (req, res, next) {
    let idKamar = req.body.idKamar;
    let idJenisKamar = req.body.idJenisKamar;
    let statusKamar = req.body.statusKamar;
    let errors = false;

    if(idKamar.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Nomor Kamar");
        res.render('kamar/create', {
            idKamar: idKamar,
            jenisKamar: idJenisKamar,
            statusKamar: statusKamar
        })
    }

    if(idJenisKamar.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Jenis Kamar");
        res.render('kamar/create', {
            idKamar: idKamar,
            jenisKamar: idJenisKamar,
            statusKamar: statusKamar
        })
    }

    if(statusKamar.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Status Kamar");
        res.render('kamar/create', {
            idKamar: idKamar,
            jenisKamar: idJenisKamar,
            statusKamar: statusKamar
        })
    }

    if(!errors) {
        let formData = {
            id_kamar: idKamar,
            id_jenis_kamar: idJenisKamar,
            status_kamar: statusKamar
        }

        connection.query('INSERT INTO kamar SET ?', formData, function (err, result) {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    req.flash('error', 'Nomor kamar telah terdaftar.');
                } else {
                    req.flash('error', 'Error: ' + err.message);
                }

                connection.query('select * from jenis_kamar', function (err, rows) {
                    if (err) throw err;
            
                    res.render('kamar/create', {
                        idKamar: '',
                        jenisKamar: rows,
                        statusKamar: '',
                    });
                });
        } else {
            req.flash('success', 'Data Berhasil Disimpan!');
            res.redirect('/kamar');
        }
        })
    }
})

module.exports = router;