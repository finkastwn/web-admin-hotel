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

router.get('/create', function (req, res, next) {
    res.render('tamu/create', {
        id_tamu: '',
        nama_tamu: '',
        jenis_identitas: '',
        no_identitas: '',
        no_hp: '',
        alamat: ''
    });
})

router.post('/store', function (req, res, next) {
    let nama_tamu = req.body.nama_tamu;
    let jenis_identitas = req.body.jenis_identitas;
    let no_identitas = req.body.no_identitas;
    let no_hp = req.body.no_hp;
    let alamat = req.body.alamat;
    let errors = false;

    if (nama_tamu.length === 0) {
        errors = true;
        req.flash('error', "Silahkan Masukkan Nama Tamu");
        res.render('tamu/create', {
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        })
    }

    if (jenis_identitas.length === 0) {
        errors = true;
        req.flash('error', "Silahkan Masukkan Jenis Identitas");
        res.render('tamu/create', {
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        })
    }

    if (no_identitas.length === 0) {
        errors = true;
        req.flash('error', "Silahkan Masukkan Nomor Identitas");
        res.render('tamu/create', {
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        })
    }

    if (no_hp.length === 0) {
        errors = true;
        req.flash('error', "Silahkan Masukkan Nomor Telepon");
        res.render('tamu/create', {
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        })
    }

    if (alamat.length === 0) {
        errors = true;
        req.flash('error', "Silahkan Masukkan Alamat");
        res.render('tamu/create', {
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        })
    }

    if (!errors) {
        let formData = {
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        }

        connection.query('INSERT INTO tamu SET ?', formData, function (err, result) {
            if (err){
                if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('no_identitas')) {
                    req.flash('error', 'Nomor Identitas terdaftar.');
                } else {
                    req.flash('error', 'Error: ' + err.message);
                }
                res.render('tamu/create', {
                    nama_tamu: formData.nama_tamu,
                    jenis_identitas: formData.jenis_identitas,
                    no_identitas: formData.no_identitas,
                    no_hp: formData.no_hp,
                    alamat: formData.alamat
                })
            } else {
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/tamu');
            }
        })
    }
})

router.get('/edit/(:id_tamu)', function (req, res, next) {
    let id_tamu = req.params.id_tamu;

    connection.query('SELECT * FROM tamu where id_tamu = ?', [id_tamu], function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.redirect('/tamu/detail/' + id_tamu)
        } else {
            res.render('tamu/edit', {
                id_tamu: rows[0].id_tamu,
                nama_tamu: rows[0].nama_tamu,
                jenis_identitas: rows[0].jenis_identitas,
                no_identitas: rows[0].no_identitas,
                no_hp: rows[0].no_hp,
                alamat: rows[0].alamat
            });
        }
    })
})

router.post('/update/(:id_tamu)', function (req, res, next) {
    let id_tamu = req.params.id_tamu;
    let nama_tamu = req.body.nama_tamu;
    let jenis_identitas = req.body.jenis_identitas;
    let no_identitas = req.body.no_identitas;
    let no_hp = req.body.no_hp;
    let alamat = req.body.alamat;
    let errors = false;

    if (nama_tamu.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Nama Tamu");
        res.render('tamu/edit', {
            id_tamu: id_tamu,
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        })
    }

    if (jenis_identitas.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Jenis Identitas");
        res.render('tamu/edit', {
            id_tamu: id_tamu,
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        })
    }

    if (no_identitas.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Nomor Identitas");
        res.render('tamu/edit', {
            id_tamu: id_tamu,
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        })
    }

    if (no_hp.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Nomor Telepon");
        res.render('tamu/edit', {
            id_tamu: id_tamu,
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        })
    }

    if (alamat.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Alamat");
        res.render('tamu/edit', {
            id_tamu: id_tamu,
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        })
    }

    if(!errors){
        let formData = {
            id_tamu: id_tamu,
            nama_tamu: nama_tamu,
            jenis_identitas: jenis_identitas,
            no_identitas: no_identitas,
            no_hp: no_hp,
            alamat: alamat
        }

        connection.query('UPDATE tamu SET ? WHERE id_tamu = ?', [formData, id_tamu], function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('tamu/edit', {
                    id_tamu: req.params.id_tamu,
                    nama_tamu: formData.nama_tamu,
                    jenis_identitas: formData.jenis_identitas,
                    no_identitas: formData.no_identitas,
                    no_hp: formData.no_hp,
                    alamat: formData.alamat
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate')
                res.redirect('/tamu/detail/' + id_tamu)
            }
        })
    }
})

router.get('/delete/(:id_tamu)', function(req, res, next) {
    let id_tamu = req.params.id_tamu
    connection.query('DELETE FROM tamu WHERE id_tamu = ?', [id_tamu], function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/tamu')
        } else {
            req.flash('success', 'Data Berhasil Dihapus')
            res.redirect('/tamu')
        }
    })
})

module.exports = router