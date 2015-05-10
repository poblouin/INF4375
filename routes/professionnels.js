var express = require('express'),
    router = express.Router(),
    validateur = require('jsonschema').validate,
    ObjectID = require('mongodb').ObjectID;

var PROFESSIONNELS = 'professionnels',
    PATTERN_HEX_STRING = "^[A-Fa-f0-9]{24}$";

var schema_post = {
    "type" : "object",
    "required" : true,
    "properties" : {
        "sexe" : {
            "description" : "Format ISO-5218",
            "type" : "number",
            "minimum" : 0,
            "maximum" : 2
        },
        "nom" : {
            "type" : "string"
        },
        "prenom" : {
            "type" : "string"
        },
        "specialite" : {
            "type" : "string"
        },
        "rencontres_2014" : {
            "type" : "array",
            "items": [ ],
            "additionalItems": false
        },
        "nombre_patients" : {
            "type" : "number",
            "enum" : [0]
        },
        "total_visites" : {
            "type" : "number",
            "enum" : [0]
        }
    },
    "required" : ["sexe", "nom", "prenom", "specialite", "rencontres_2014", "nombre_patients", "total_visites"],
    "additionalProperties": false
};

var schema_put = {
    "type" : "object",
    "required" : true,
    "properties" : {
        "sexe" : {
            "description" : "Format ISO-5218",
            "type" : "number",
            "minimum" : 0,
            "maximum" : 2
        },
        "nom" : {
            "type" : "string"
        },
        "prenom" : {
            "type" : "string"
        },
        "specialite" : {
            "type" : "string",
        },
        "rencontres_2014" : {
            "type" : "array",
            "items" : {
                "type": "object",
                "properties" : {
                    "nom" : {
                        "type" : "string",
                    },
                    "prenom" : {
                        "type" : "string"
                    },
                    "id" : {
                        "type" : "string",
                        "pattern" : PATTERN_HEX_STRING
                    }
                },
                "required" : ["nom", "prenom", "id"],
                "additionalProperties": false
            }
        },
        "nombre_patients" : {
            "type" : "number"
        },
        "total_visites" : {
            "type" : "number"
        }
    },
    "additionalProperties": false
};

router.param('id' , function(req, res, next, id) {
    var db = req.db;
    var regex = /[A-Fa-f0-9]{24}/;

    if(!regex.test(id)) return next({message : "400 - Le paramètre id doit être composé de 24 caractères hexadicémaux.", status : 400});

    db.collection(PROFESSIONNELS).findOne({_id : ObjectID(id)}, function(err, doc) {
        if(err)
            return next(err);
        else if(doc === null)
            return next({message : "404 - Professionnel inexistant.", status : 404});

        req.professionnel = doc;
        next();
    });
});

/*
* GET liste des professionnels.
*/
router.get('/liste', function(req, res, next) {
    var db = req.db;

    db.collection(PROFESSIONNELS).find({}, {fields:{specialite : 1, nom : 1, prenom : 1}}).toArray( function(err, doc) {
        if(err)
            return next(err);
        res.json(doc);
    });
});

/* GET consulter professionnel */
router.get('/consulter/:id', function(req, res) {
    var id = req.params.id;
    res.render('consulter', {title: "Consulter un professionnel", "pros" : id});
});

/* GET modifier professionnel */
router.get('/modifier/:id', function(req, res) {
    var id = req.params.id;
    res.render('modifier', {title: "Modifier un professionnel", "pros" : id});
});

/* GET ajouter professionnel */
router.get('/ajouter', function(req, res) {
    var id = req.params.id;
    res.render('ajouter', {title: "Ajouter un nouveau professionnel", "pros" : id});
});

/*
* GET /pros/:id
* Consulter un professionnel.
*/
router.get('/:id', function(req, res, next) {
    res.status(200).json(req.professionnel);
});

/*
* POST /pros
* Créer un professionnel.
*/
router.post('/', function(req, res, next) {
    var json = req.body;
    var db = req.db;

    var resultat = validateur(json, schema_post);

    if (resultat.errors.length === 0) {
        db.collection(PROFESSIONNELS).insert(json, {w : 1}, function(err, doc) {
            if(err) return next(err);
            res.status(201).json(doc[0]);
        });
    } else
        return next({message : "400 - Les données entrées ne respectent pas le format attendu.", status : 400});
});

/*
* PUT /pros/:id
* Modifier un professionnel.
*/
router.put('/:id', function(req, res, next) {
    var professionnel = req.professionnel;
    var json = req.body;
    var db = req.db;

    var resultat = validateur(json, schema_put);

    if (resultat.errors.length === 0) {
        db.collection(PROFESSIONNELS).findAndModify({_id : professionnel._id}, [['_id', 1]], {$set : json}, {new : true, w : 1}, function(err, doc) {
            if(err) return next(err);
            res.status(200).json(doc);
        });
    } else
        return next({message : "400 - Les données entrées ne respectent pas le format attendu.", status : 400});
});

/*
* DELETE /pros/:id
* Supprime un professionnel.
*/
router.delete('/:id', function(req, res, next) {
    var db = req.db;
    var professionnel = req.professionnel;

    if(professionnel.rencontres_2014.length !== 0)
        return next({message : "403 - Il est impossible de supprimer un professionnel s'il a eu des visites en 2014.", status : 403});

    db.collection(PROFESSIONNELS).remove({_id : professionnel._id}, {w : 1}, function(err, doc) {
        if(err) return next(err);
        res.status(200).json(professionnel);
    });
});

module.exports = router;
