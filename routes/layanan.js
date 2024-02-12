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

router.get('/pesan-extra-bed/(:id_penginapan)', function(req, res, next) { 
    let id_penginapan = req.params.id_penginapan;

    connection.query(`SELECT p.id_kamar, t.nama_tamu 
    FROM penginapan p
    JOIN tamu t
    ON p.id_tamu = t.id_tamu
    WHERE
    id_penginapan = ?`, [id_penginapan], function(err, rows) {
        if(err) throw err;

        connection.query(`select * from layanan where jenis_layanan = 'EXTRA_BED'`, function(err, layanan) {
            res.render('layanan/pesan-layanan', {
                id_penginapan: id_penginapan,
                nama_tamu: rows[0].nama_tamu,
                id_kamar: rows[0].id_kamar,
                layanan: layanan,
                kuota:'',
                jenis_layanan: layanan[0].jenis_layanan
            })
        })
    })
})

router.get('/pesan-laundry/(:id_penginapan)', function(req, res, next) { 
    let id_penginapan = req.params.id_penginapan;

    connection.query(`SELECT p.id_kamar, t.nama_tamu 
    FROM penginapan p
    JOIN tamu t
    ON p.id_tamu = t.id_tamu
    WHERE
    id_penginapan = ?`, [id_penginapan], function(err, rows) {
        if(err) throw err;

        connection.query(`select * from layanan where jenis_layanan = 'LAUNDRY'`, function(err, layanan) {
            res.render('layanan/pesan-layanan', {
                id_penginapan: id_penginapan,
                nama_tamu: rows[0].nama_tamu,
                id_kamar: rows[0].id_kamar,
                layanan: layanan,
                kuota:'',
                jenis_layanan: layanan[0].jenis_layanan
            })
        })
    })
})

router.get('/pesan-fnb/(:id_penginapan)', function(req, res, next) { 
    let id_penginapan = req.params.id_penginapan;

    connection.query(`SELECT p.id_kamar, t.nama_tamu 
    FROM penginapan p
    JOIN tamu t
    ON p.id_tamu = t.id_tamu
    WHERE
    id_penginapan = ?`, [id_penginapan], function(err, rows) {
        if(err) throw err;

        connection.query(`select * from layanan where jenis_layanan = 'FnB'`, function(err, layanan) {
            res.render('layanan/pesan-layanan', {
                id_penginapan: id_penginapan,
                nama_tamu: rows[0].nama_tamu,
                id_kamar: rows[0].id_kamar,
                layanan: layanan,
                kuota:'',
                jenis_layanan: layanan[0].jenis_layanan
            })
        })
    })
})

router.get('/pesan-minibar/(:id_penginapan)', function(req, res, next) { 
    let id_penginapan = req.params.id_penginapan;

    connection.query(`SELECT p.id_kamar, t.nama_tamu 
    FROM penginapan p
    JOIN tamu t
    ON p.id_tamu = t.id_tamu
    WHERE
    id_penginapan = ?`, [id_penginapan], function(err, rows) {
        if(err) throw err;

        connection.query(`select * from layanan where jenis_layanan = 'MINIBAR'`, function(err, layanan) {
            res.render('layanan/pesan-layanan', {
                id_penginapan: id_penginapan,
                nama_tamu: rows[0].nama_tamu,
                id_kamar: rows[0].id_kamar,
                layanan: layanan,
                kuota:'',
                jenis_layanan: layanan[0].jenis_layanan
            })
        })
    })
})

router.post('/pesan/(:id_penginapan)', async(req, res) => {
    try {
        let id_penginapan = req.params.id_penginapan;
        const namaItemArray = req.body.nama_item;
        const kuotaArray = req.body.kuota;
        let id_layanan, kuota;

        await connection.beginTransaction();

        if (Array.isArray(namaItemArray)) {
            for(let i = 0; i < namaItemArray.length; i++){
                id_layanan = namaItemArray[i];
                kuota = kuotaArray[i]
    
                await connection.query(`INSERT INTO pendapatan_layanan (id_layanan, id_penginapan, jumlah_item) VALUES (?,?,?)`, [id_layanan, id_penginapan, kuota])
            }
            
        } else {

            await connection.query(`INSERT INTO pendapatan_layanan (id_layanan, id_penginapan, jumlah_item) VALUES (?,?,?)`, [namaItemArray, id_penginapan, kuotaArray]);

        }

        await connection.commit();

        req.flash('success', 'Layanan Berhasil Dipesan!');
        res.redirect('/penginapan')
    } catch (error) {
        await connection.rollback();
        req.flash('error', error);
    }
})
module.exports = router;