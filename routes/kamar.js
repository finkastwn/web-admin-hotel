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

router.get('/edit/:idKamar', function (req, res, next) {
    const idKamar = req.params.idKamar;

    connection.query('SELECT * FROM kamar JOIN jenis_kamar ON kamar.id_jenis_kamar = jenis_kamar.id_jenis_kamar WHERE kamar.id_kamar = ?', [idKamar], function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Data Post Dengan ID ' + idKamar + " Tidak Ditemukan")
            res.redirect('/kamar')
        }
        // if room found
        else {
            // Retrieve jenisKamar data from the database
            connection.query('SELECT * FROM jenis_kamar', function(err, jenisKamar, fields) {
                if(err) throw err;

                res.render('kamar/edit', {
                    idKamar: rows[0].id_kamar,
                    jenisKamar: jenisKamar,
                    statusKamar: rows[0].status_kamar,
                    selectedJenisKamar: String(rows[0].id_jenis_kamar)
                });
            });
        }
    })
})

router.post('/update/:idKamar', function(req, res, next) {
    let idJenisKamar = req.body.idJenisKamar;
    let statusKamar = req.body.statusKamar;
    let errors = false;

    if(idJenisKamar.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Pilih Jenis Kamar");
        res.render('kamar/edit', {
            idKamar: req.params.idKamar,
            idJenisKamar: idJenisKamar,
            statusKamar: statusKamar
        })
    }

    if(statusKamar.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Pilih Jenis Kamar");
        res.render('kamar/edit', {
            idKamar: req.params.idKamar,
            idJenisKamar: idJenisKamar,
            statusKamar: statusKamar
        })
    }

    if(!errors){
        let formData = {
            id_jenis_kamar: idJenisKamar,
            status_kamar: statusKamar
        }

        connection.query('UPDATE kamar SET ? WHERE id_kamar = ?', [formData, req.params.idKamar], function(err, result) {
            if(err) {
                req.flash('error', err)
                res.render('kamar/edit', {
                    idKamar: req.params.idKamar,
                    idJenisKamar: idJenisKamar,
                    statusKamar: statusKamar
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/kamar');
            }
        })
    }
})

router.get('/delete/(:idKamar)', function(req, res, next) {
    let idKamar = req.params.idKamar;

    connection.query('DELETE FROM kamar WHERE id_kamar = ?', [idKamar], function(err, result) {
        if(err) {
            req.flash('error', err)
            res.redirect('/kamar')
        } else {
            req.flash('success', 'Data Berhasil Dihapus!');
            res.redirect('/kamar')
        }
    })
})

module.exports = router;