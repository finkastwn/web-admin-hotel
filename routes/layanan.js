var express = require('express');
var router = express.Router();
var connection = require('../library/database');

router.get('/', function (req, res, next) {
    connection.query(`SELECT * FROM layanan 
    ORDER BY jenis_layanan asc, nama_item asc`, function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('layanan', {
                data: ''
            });
        } else {
            res.render('layanan/index', {
                data: rows
            });
        }
    });
})

router.get('/create', function (req, res, next) {
    res.render('layanan/create', {
        jenis_layanan: '',
        nama_item:'',
        harga_item: '',
        kuota: '',
    })
})

router.post('/store', function (req, res, next) {
    let jenis_layanan = req.body.jenis_layanan;
    let nama_item = req.body.nama_item;
    let harga_item_input = req.body.harga_item;
    let harga_item = harga_item_input.replace(/[^\d]/g, '');
    let kuota = req.body.kuota;
    let errors = false;

    if(jenis_layanan.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Jenis Layanan");
        res.render('layanan/create', {
            jenis_layanan: jenis_layanan,
            nama_item: nama_item,
            harga_item: harga_item,
            kuota: kuota
        })
    }

    if(nama_item.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Nama Item");
        res.render('layanan/create', {
            jenis_layanan: jenis_layanan,
            nama_item: nama_item,
            harga_item: harga_item,
            kuota: kuota
        })
    }

    if(harga_item.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Harga Item");
        res.render('layanan/create', {
            jenis_layanan: jenis_layanan,
            nama_item: nama_item,
            harga_item: harga_item,
            kuota: kuota
        })
    }

    if (!kuota) {
        kuota = null;
    }

    if(!errors){
        let formData = {
            jenis_layanan: jenis_layanan,
            nama_item: nama_item,
            harga_item: harga_item,
            kuota: kuota
        }

        connection.query('INSERT INTO layanan SET ?', formData, function(err, result) {
            if(err) {
                req.flash('error', err);
                res.render('layanan/create', {
                    jenis_layanan: jenis_layanan,
                    nama_item: nama_item,
                    harga_item: harga_item,
                    kuota: kuota
                })
            } else {
                req.flash('success', 'Data Layanan Berhasil Disimpan');
                res.redirect('/layanan');
            }
        })
    }
})

router.get('/edit/(:id_layanan)', function(req, res, next) {
    let id_layanan = req.params.id_layanan;

    connection.query('SELECT * FROM layanan WHERE id_layanan = ?', [id_layanan], function(err, rows) {
        if(err) {
            req.flash('error', err);
            res.redirect('/layanan');
        } else {
            res.render('layanan/edit', {
                id_layanan: rows[0].id_layanan,
                jenis_layanan: rows[0].jenis_layanan,
                nama_item: rows[0].nama_item,
                harga_item: rows[0].harga_item,
                kuota: rows[0].kuota                
            });
        }
    })
})

router.post('/update/(:id_layanan)', function(req, res, next) {
    let id_layanan = req.params.id_layanan;
    let jenis_layanan = req.body.jenis_layanan;
    let nama_item = req.body.nama_item;
    let harga_item_input = req.body.harga_item;
    let harga_item = harga_item_input.replace(/[^\d]/g, '');
    let kuota = req.body.kuota;
    let errors = false;

    if(jenis_layanan.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Harga Item");
        res.render('layanan/create', {
            jenis_layanan: jenis_layanan,
            nama_item: nama_item,
            harga_item: harga_item,
            kuota: kuota
        })
    }

    if(nama_item.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Harga Item");
        res.render('layanan/create', {
            jenis_layanan: jenis_layanan,
            nama_item: nama_item,
            harga_item: harga_item,
            kuota: kuota
        })
    }

    if(harga_item.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Harga Item");
        res.render('layanan/create', {
            jenis_layanan: jenis_layanan,
            nama_item: nama_item,
            harga_item: harga_item,
            kuota: kuota
        })
    }

    if (!kuota) {
        kuota = null;
    }

    if(!errors){
        let formData = {
            jenis_layanan:jenis_layanan,
            nama_item: nama_item,
            harga_item: harga_item,
            kuota: kuota
        }

        connection.query('UPDATE layanan SET ? WHERE id_layanan = ?', [formData, id_layanan], function(err, result) {
            if(err) {
                req.flash('error', err);
                res.render('layanan/edit', {
                    id_layanan: id_layanan,
                    jenis_layanan: jenis_layanan,
                    nama_item: nama_item,
                    harga_item: harga_item,
                    kuota: kuota
                })
            } else {
                req.flash('success', 'Data Layanan Berhasil Disimpan');
                res.redirect('/layanan');
            }
        })
    }
})

router.get('/delete/(:id_layanan)', function(req, res, next) {
    let id_layanan = req.params.id_layanan;

    connection.query('DELETE FROM layanan WHERE id_layanan = ?', [id_layanan], function(err, result) {
        if(err) {
            req.flash('error', err)
            res.redirect('/layanan')
        } else {
            req.flash('success', 'Data Berhasil Dihapus!');
            res.redirect('/layanan')
        }
    })
})

module.exports = router;