var express = require('express');
var router = express.Router();
var connection = require('../library/database');

router.get('/', function (req, res, next) {
    connection.query(`SELECT p.id_kamar, t.nama_tamu, p.tanggal_checkin, p.tanggal_checkout
    from penginapan p
    JOIN tamu t
    ON p.id_tamu = t.id_tamu
    WHERE p.status_inap = 'CHECKED_IN'
    order by p.id_kamar asc`, function (err, rows) {
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

module.exports = router