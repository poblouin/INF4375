var express = require('express'),
    router = express.Router(),
    validateur = require('jsonschema').validate,
    ObjectID = require('mongodb').ObjectID;

var DOSSIERS = 'dossiers',
    PATTERN_GROUPE_SANGUIN ="^(A|B|AB|O)[+-]$",
    PATTERN_DATE = "^(19[0-9]{2}|200[0-9]|201[0-4])-(1[0-2]|0[1-9])-([0-2][0-9]|3[0-1])$";

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
        "date_naissance" : {
            "description" : "Format ISO-8601",
            "type" : "string",
            "pattern" : PATTERN_DATE
        },
        "groupe_sanguin" : {
            "type" : "string",
            "pattern" : PATTERN_GROUPE_SANGUIN
        },
        "poids_kg" : {
            "type" : "number",
            "minimum" : 0,
            "exclusiveMinimum": true
        },
        "taille_cm" : {
            "type" : "number",
            "minimum" : 0,
            "exclusiveMinimum": true
        },
        "don_organes" :  {
            "type" : "boolean"
        },
        "visites" : {
            "type" : "array",
            "items": [ ],
            "additionalItems": false
        }
    },
    "required" : ["sexe", "nom", "prenom", "date_naissance", "groupe_sanguin", "poids_kg", "taille_cm", "don_organes", "visites"],
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
        "date_naissance" : {
            "description" : "Format ISO-8601",
            "type" : "string",
            "pattern" : PATTERN_DATE
        },
        "groupe_sanguin" : {
            "type" : "string",
            "pattern" : PATTERN_GROUPE_SANGUIN
        },
        "poids_kg" : {
            "type" : "number",
            "minimum" : 0,
            "exclusiveMinimum": true
        },
        "taille_cm" : {
            "type" : "number",
            "minimum" : 0,
            "exclusiveMinimum": true
        },
        "don_organes" :  {
            "type" : "boolean"
        },
        "visites" : {
            "type" : "array",
            "items" : {
                "type": "object",
                "properties" : {
                    "date" : {
                        "description" : "Format ISO-8601",
                        "type" : "string",
                        "pattern" : PATTERN_DATE
                    },
                    "nom_professionnel" : {
                        "type" : "string"
                    },
                    "specialite" : {
                        "type" : "string"
                    }
                },
                "required" : ["date", "nom_professionnel", "specialite"],
                "additionalProperties": false
            }
        }
    },
    "additionalProperties": false
};


router.param('id' , function(req, res, next, id) {
    var db = req.db;
    var regex = /[A-Fa-f0-9]{24}/;

    if(!regex.test(id)) return next({message : {400 : "Le paramètre id doit être composé de 24 caractères hexadicémaux."}, status : 400});

    db.collection(DOSSIERS).findOne({_id : ObjectID(id)}, function(err, doc) {
        if(err)
            return next(err);
        else if(doc === null)
            return next({message : {404 : "Dossier de patient inexistant."}, status : 404});

        req.dossier = doc;
        next();
    });
});

/*
* GET /dossiers/:id
* Consulter un dossier de patient.
*/
router.get('/:id', function(req, res, next) {
    return res.status(200).json(req.dossier);
});

/*
* POST /dossiers
* Créer un dossier de patient.
*/
router.post('/', function(req, res, next) {
    var json = req.body;
    var db = req.db;

    var resultat = validateur(json, schema_post);

    if (resultat.errors.length === 0) {
        db.collection(DOSSIERS).insert(json, {w : 1}, function(err, doc) {
            if(err) return next(err);
            return res.status(201).json(doc[0]);
        });
    } else
        return next({message : {400 : "Les données entrées ne respectent pas le format attendu."}, status : 400});
});

/*
* PUT /dossiers/:id
* Modifier un dossier de patient.
*/
router.put('/:id', function(req, res, next) {
    var dossier = req.dossier;
    var json = req.body;
    var db = req.db;

    var resultat = validateur(json, schema_put);

    if (resultat.errors.length === 0) {
        db.collection(DOSSIERS).findAndModify({_id : dossier._id}, [['_id', 1]], {$set : json}, {new : true, w : 1}, function(err, doc) {
            if(err) return next(err);
            return res.status(200).json(doc);
        });
    } else
        return next({message : {400 : "Les données entrées ne respectent pas le format attendu."}, status : 400});
});

/*
* DELETE /dossiers/:id
* Supprime un dossier de patient.
*/
router.delete('/:id', function(req, res, next) {
    var db = req.db;
    var dossier = req.dossier;
    var date_aujourdhui = new Date();
    var date_aujourdhui_moins_5_ans = new Date();
    date_aujourdhui_moins_5_ans.setFullYear(date_aujourdhui.getFullYear()-5, date_aujourdhui.getMonth(), date_aujourdhui.getDate());

    for(var i = 0; i < dossier.visites.length; i++) {
        var visite = dossier.visites[i];
        var date_visite = new Date(visite.date);

        if(date_visite >= date_aujourdhui_moins_5_ans)
            return next({message : {403 : "Il est impossible de supprimer un dossier si le patient a "
                + "visité un professionnel dans les 5 dernières années."}, status : 403});
    }
    db.collection(DOSSIERS).remove({_id : dossier._id}, {w : 1}, function(err, doc) {
        if(err) return next(err);
        return res.status(200).json(dossier);
    });
});

module.exports = router;
