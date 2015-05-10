/*
 *  Travail pratique 1
 *  INF4375 - Paradigmes des échanges Internet
 *
 *  Pierre-Olivier Blouin
 *  BLOP11068701
 *  blouin.pierre-olivier.2@courrier.uqam.ca
 *
 *
 *  Ce programmme effectue du parsing de fichiers XML contenant de l'nformation
 *  sur des dossiers de patients, des professionnels et des visites et va ajouter les
 *  données dans MongoDB.
 *
 *  Considérations techniques
 *     $ node -v v0.10.32
 *     $ mongo -version MongoDB shell version: 2.6.5
 */

var fs = require('fs'),
    json_parser = require('xml2json'),
    mongo_client = require('mongodb').MongoClient,
    hashmap = require('hashmap').HashMap,
    async = require('async');
    ObjectID = require('mongodb').ObjectID;

var ANNEE_2014 = '2014',
    RACINE_DOSSIERS = 'dossiers', TAG_DOSSIER = 'dossier',
    RACINE_PROFESSIONNELS = 'professionnels', TAG_PROFESSIONNEL = 'professionnel',
    RACINE_VISITES = 'visites', TAG_VISITE = 'visite';

var map_dossiers = new hashmap(),
    map_professionnels = new hashmap(),
    map_rencontres = new hashmap(),
    visites = [],
    fichiers = ['migration/dossiers.xml', 'migration/professionnels.xml', 'migration/visites.xml'];

function lire_fichier(fichier, callback) {
    fs.readFile(fichier, function(err, donnees) {
        if(err)
            callback(err);
        callback(null, donnees);
    });
}

function parse_fichier_xml(donnees, callback) {
    var json = json_parser.toJson(donnees, {sanitize:false, object:true}),
        racine = '',
        tag = '';

    if(json.dossiers !== undefined) {
        racine = RACINE_DOSSIERS;
        tag = TAG_DOSSIER;
    } else if(json.professionnels !== undefined) {
        racine = RACINE_PROFESSIONNELS;
        tag = TAG_PROFESSIONNEL;
    } else if(json.visites !== undefined) {
        racine = RACINE_VISITES;
        tag = TAG_VISITE;
    } else
        callback(new Error('Erreur! Le fichier fourni ne respecte pas le format attendu.'));

    for(var i = 0; i < json[racine][tag].length; i++) {
        var courant = json[racine][tag][i];
        if(tag === TAG_DOSSIER) {
            var dossier = {
                _id : new ObjectID(courant.id),
                sexe : courant.sexe,
                nom : courant.nom,
                prenom : courant.prenom,
                date_naissance : courant.dateNaissance,
                groupe_sanguin : courant.groupeSanguin,
                poids_kg : courant.poidsKg,
                taille_cm : courant.tailleCm,
                don_organes : courant.donOrganes == 0 ? false : true,
                visites : []
            };
            map_dossiers.set(dossier._id.toHexString(), dossier);
        } else if(tag === TAG_PROFESSIONNEL) {
            var professionnel = {
                _id : new ObjectID(courant.id),
                sexe : courant.sexe,
                nom : courant.nom,
                prenom : courant.prenom,
                specialite : courant.specialite,
                rencontres_2014 : [],
                nombre_patients : 0,
                total_visites : 0
            };
            map_professionnels.set(professionnel._id.toHexString(), professionnel);
            map_rencontres.set(professionnel._id.toHexString(), []);
        } else
            visites.push(courant);
    }
    callback();
}

function comptabiliser_visites(callback) {
    for(var i = 0; i < visites.length; i++) {
        var dossier = map_dossiers.get(visites[i].patient),
            professionnel = map_professionnels.get(visites[i].professionnel),
            tab_rencontres = map_rencontres.get(visites[i].professionnel);
        var rencontre = {
            nom : dossier.nom,
            prenom : dossier.prenom,
            id : dossier._id.toHexString()
        };
        var visite = {
            date : visites[i].date,
            nom_professionnel : professionnel.nom + ' ' + professionnel.prenom,
            specialite : professionnel.specialite
        };
        dossier.visites.push(visite);

        var trouve = false;
        for(var j = 0; j < tab_rencontres.length && !trouve; j++)
            if(tab_rencontres[j].id === dossier._id.toHexString()) trouve = true;

        if(!trouve && visites[i].date.substring(0,4) === ANNEE_2014) {
            tab_rencontres.push(rencontre);
            professionnel.rencontres_2014.push(rencontre);
            professionnel.nombre_patients += 1;
        } else if (!trouve) {
            tab_rencontres.push(rencontre);
            professionnel.nombre_patients += 1;
        }
        professionnel.total_visites += 1;
    }
    callback([map_dossiers, map_professionnels]);
}

function inserer_donnees(donnees) {
    var nom_collection = '';

    if(donnees === map_dossiers)
        nom_collection = RACINE_DOSSIERS;
    else
        nom_collection = RACINE_PROFESSIONNELS;

    mongo_client.connect('mongodb://localhost:27017/BLOP11068701', function(err, db) {
        if(err)
            throw(err);
        db.collection(nom_collection).insert(donnees.values(), {w: 1}, function(err, res) {
            if(err)
                throw(err);
            db.close();
        });
    });
}

async.map(fichiers, lire_fichier, function(err, resultat) {
    if(err) throw err;

    async.map(resultat, parse_fichier_xml, function(err) {
        if(err) throw err;

        comptabiliser_visites(function(donnees) {
            async.map(donnees, inserer_donnees, function(err, res) {
                if(err) throw err;
            });
        });
    });
});
