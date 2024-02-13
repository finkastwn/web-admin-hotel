var express = require('express');
var router = express.Router();
var connection = require('../library/database');

router.get('/', function (req, res, next) {
    connection.query(`SELECT p.id_kamar, t.nama_tamu, p.tanggal_checkin, p.tanggal_checkout, id_penginapan
    from penginapan p
    JOIN tamu t
    ON p.id_tamu = t.id_tamu
    WHERE p.status_inap = 'CHECKED_IN'
    order by p.tanggal_checkout asc`, function (err, rows) {
        if (err) throw err;

        res.render('penginapan/index', {
            data: rows
        });
    })
})

router.get('/check-in/(:id_tamu)', function (req, res, next) {
    let id_tamu = req.params.id_tamu;

    connection.query(`SELECT * FROM tamu WHERE id_tamu = ?`, [id_tamu], function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.redirect('/tamu')
        } else {
            connection.query(`SELECT * FROM kamar k
            JOIN jenis_kamar j
            ON k.id_jenis_kamar = j.id_jenis_kamar
            WHERE k.status_kamar = 'READY'`, function (err, kamar) {
                res.render('penginapan/check-in', {
                    id_tamu: rows[0].id_tamu,
                    nama_tamu: rows[0].nama_tamu,
                    jenis_identitas: rows[0].jenis_identitas,
                    no_identitas: rows[0].no_identitas,
                    no_hp: rows[0].no_hp,
                    tanggal_checkin: '',
                    tanggal_checkout: '',
                    kamar: kamar,
                });
            })
        }
    })
})

router.post('/checked-in/(:id_tamu)', function (req, res, next) {
    let id_tamu = req.params.id_tamu;
    let id_kamar = req.body.id_kamar;
    let tanggal_checkin = req.body.tanggal_checkin;
    let tanggal_checkout = req.body.tanggal_checkout;
    let errors = false;

    if (id_kamar.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Pilih Kamar");
        res.render('penginapan/check-in', {
            id_tamu: id_tamu,
            id_kamar: id_kamar,
            tanggal_checkin: tanggal_checkin,
            tanggal_checkout: tanggal_checkout
        })
    }

    if (tanggal_checkin.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Pilih Tanggal Check-in");
        res.render('penginapan/check-in', {
            id_tamu: id_tamu,
            id_kamar: id_kamar,
            tanggal_checkin: tanggal_checkin,
            tanggal_checkout: tanggal_checkout
        })
    }

    if (tanggal_checkout.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Pilih Tanggal Check-out");
        res.render('penginapan/check-in', {
            id_tamu: id_tamu,
            id_kamar: id_kamar,
            tanggal_checkin: tanggal_checkin,
            tanggal_checkout: tanggal_checkout
        })
    }

    if(!errors){
        let formData = {
            id_tamu: id_tamu,
            id_kamar: id_kamar,
            tanggal_checkin: tanggal_checkin,
            tanggal_checkout: tanggal_checkout,
            status_inap: 'CHECKED_IN'
        }

        connection.query('INSERT INTO penginapan SET ?', formData, function (err, result) {
            if (err) {
                req.flash('error', err)
                res.render('penginapan/check-in', {
                    id_tamu: id_tamu,
                    id_kamar: id_kamar,
                    tanggal_checkin: tanggal_checkin,
                    tanggal_checkout: tanggal_checkout
                })
            } else {
                connection.query('UPDATE kamar SET status_kamar = ? WHERE id_kamar = ?', ['NOT_READY', id_kamar], function (updare_err, update_result) { 
                    if(updare_err){
                        req.flash('error', updare_err);
                        res.redirect('/tamu');
                    } else {
                        req.flash('success', 'Tamu Berhasil Check-In!');
                        res.redirect('/penginapan');
                    }
                })
            }
        })
    }
})

router.get('/check-out/(:id_penginapan)', function(req, res, next) {
    let id_penginapan = req.params.id_penginapan;

    connection.query(`SELECT * FROM penginapan WHERE id_penginapan = ?`, [id_penginapan], function(err, rows) {
        if(err) throw err;
        let id_kamar = rows[0].id_kamar;

        connection.query(`UPDATE kamar SET status_kamar = 'ON_CLEANING' WHERE id_kamar = ?`, [id_kamar], function(updateError, result) {
            if(updateError) {
                req.flash('error', updateError)
                res.redirect('/penginapan')
            } else {
                connection.query(`UPDATE penginapan SET status_inap = 'CHECKED_OUT' WHERE id_penginapan = ?`, [id_penginapan], function(updateInapErr, result) {
                    if(updateInapErr) throw updateInapErr;
                    req.flash('success', 'Pengunjung Berhasil Check-Out!');
                    res.redirect('/penginapan')
                })
            }
        })
    })
    
})

router.get('/detail/(:id_penginapan)', function(req, res, next) {
    let id_penginapan = req.params.id_penginapan;

    connection.query(`SELECT t.nama_tamu, t.jenis_identitas, t.no_identitas, 
    p.tanggal_checkin, p.tanggal_checkout, p.id_penginapan,
    l.jenis_layanan, l.nama_item, l.harga_item,
    pl.jumlah_item, (pl.jumlah_item * l.harga_item) AS total_harga
    FROM 
        penginapan p 
    join 
        tamu t 
    on 
        p.id_tamu = t.id_tamu 
    left join 
        pendapatan_layanan pl 
    on 
        p.id_penginapan = pl.id_penginapan 
    left join 
        layanan l 
    on 
        l.id_layanan = pl.id_layanan
    where 
        p.id_penginapan = ?`, [id_penginapan], function(err, rows) {
        if(err) throw err;

        connection.query(`SELECT 
        SUM(pl.jumlah_item * l.harga_item) AS total_tagihan
        from 
            penginapan p 
        join 
            tamu t ON p.id_tamu = t.id_tamu 
        join 
            pendapatan_layanan pl ON p.id_penginapan = pl.id_penginapan 
        join 
            layanan l ON l.id_layanan = pl.id_layanan
        WHERE 
        p.id_penginapan = ?`, [id_penginapan], function(err, tagihan) {
            res.render('penginapan/detail', {
                data:rows,
                tagihan: tagihan
            })
        })
    })
})

module.exports = router