const accounting = require('accounting');
var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

/**
 * INDEX JENIS_KAMAR
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM jenis_kamar ORDER BY id_jenis_kamar asc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('jenis-kamar', {
                data: ''
            });
        } else {
            res.render('jenis-kamar/index', {
                data: rows
            });
        }
    });
});

/**
 * CREATE POST
 */
router.get('/create', function (req, res, next) {
    res.render('jenis-kamar/create', {
        tipeKamar: '',
        harga: ''
    })
})

/**
 * STORE POST
 */
router.post('/store', function (req, res, next) {
    
    let tipeKamar   = req.body.tipeKamar;
    let hargaInput = req.body.harga;
    let harga = hargaInput.replace(/[^\d]/g, '');
    let errors  = false;

    if(tipeKamar.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Tipe Kamar");
        // render to add.ejs with flash message
        res.render('jenis-kamar/create', {
            tipeKamar: tipeKamar,
            harga: harga
        })
    }

    if(harga.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to add.ejs with flash message
        res.render('jenis-kamar/create', {
            tipeKamar: tipeKamar,
            harga: harga
        })
    }

    // if no error
    if(!errors) {

        let formData = {
            tipe_kamar: tipeKamar,
            harga: harga
        }
        
        // insert query
        connection.query('INSERT INTO jenis_kamar SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('jenis-kamar/create', {
                    tipeKamar: formData.tipe_kamar,
                    harga: formData.harga                    
                })
            } else {                
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/jenis-kamar');
            }
        })
    }

})

/**
 * EDIT POST
 */
router.get('/edit/(:id_jenis_kamar)', function(req, res, next) {

    let id_jenis_kamar = req.params.id_jenis_kamar;
   
    connection.query('SELECT * FROM jenis_kamar WHERE id_jenis_kamar = ?', [id_jenis_kamar], function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Data Post Dengan ID ' + id_jenis_kamar + " Tidak Ditemukan")
            res.redirect('/jenis-kamar')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('jenis-kamar/edit', {
                id_jenis_kamar:      rows[0].id_jenis_kamar,
                tipe_kamar:   rows[0].tipe_kamar,
                harga: rows[0].harga
            })
        }
    })
})

/**
 * UPDATE POST
 */
router.post('/update/:id_jenis_kamar', function(req, res, next) {

    let id_jenis_kamar = req.params.id_jenis_kamar;
    let tipe_kamar   = req.body.tipe_kamar;
    let harga = req.body.harga;
    let errors  = false;

    if(tipe_kamar.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Tipe Kamar");
        // render to edit.ejs with flash message
        res.render('jenis-kamar/edit', {
            id_jenis_kamar:         req.params.id_jenis_kamar,
            tipe_kamar:      tipe_kamar,
            harga:    harga
        })
    }

    if(harga.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to edit.ejs with flash message
        res.render('jenis-kamar/edit', {
            id_jenis_kamar:         req.params.id_jenis_kamar,
            tipe_kamar:      tipe_kamar,
            harga:    harga
        })
    }

    // if no error
    if( !errors ) {   
        let hargaValue = harga.replace(/[^\d]/g, '');

        let formData = {
            tipe_kamar: tipe_kamar,
            harga: hargaValue
        }

        // update query
        connection.query('UPDATE jenis_kamar SET ? WHERE id_jenis_kamar = ?', [formData, id_jenis_kamar], function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('jenis-kamar/edit', {
                    id_jenis_kamar:     req.params.id_jenis_kamar,
                    tipe_kamar:   formData.tipe_kamar,
                    harga: formData.harga
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/jenis-kamar');
            }
        })
    }
})

/**
 * DELETE POST
 */
router.get('/delete/(:id_jenis_kamar)', function(req, res, next) {

    let id_jenis_kamar = req.params.id_jenis_kamar;
     
    connection.query('DELETE FROM jenis_kamar WHERE id_jenis_kamar = ?', [id_jenis_kamar], function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to posts page
            res.redirect('/jenis-kamar')
        } else {
            // set flash message
            req.flash('success', 'Data Berhasil Dihapus!')
            // redirect to posts page
            res.redirect('/jenis-kamar')
        }
    })
})

module.exports = router;