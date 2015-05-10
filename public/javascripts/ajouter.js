$(document).ready(function() {
    $('#sexe').on('input', function() {
        var sexe = $('#sexe').val();
        valider_sexe(sexe);
    });

    $('#nom').on('input', function() {
        var nom = $('#nom').val();
        valider_nom(nom);
    });

    $('#prenom').on('input', function() {
        var prenom = $('#prenom').val();
        valider_prenom(prenom);
    });

    $('#specialite').on('input', function() {
        var specialite = $('#specialite').val();
        valider_specialite(specialite);
    });
});

var ERREUR_STRING = 'Le champ doit contenir au moins un caractère et doit contenir seulement des lettres.';

function valider_sexe(sexe) {
    var regex = /^[1-2]$/;

    if(!regex.test(sexe)) {
        $('#sexe_invalide').html('Les valeurs acceptées sont : 1 pour un homme et 2 pour une femme.');
        $('#sexe').attr('class', 'invalide');
    } else {
        $('#sexe_invalide').html('');
        $('#sexe').removeAttr('class', 'invalide');
    }
};

function valider_nom(nom) {
    if(!valider_string(nom)) {
        $('#nom_invalide').html(ERREUR_STRING);
        $('#nom').attr('class', 'invalide');
    } else {
        $('#nom_invalide').html('');
        $('#nom').removeAttr('class', 'invalide');
    }
};

function valider_prenom(prenom) {
    if(!valider_string(prenom)) {
        $('#prenom_invalide').html(ERREUR_STRING);
        $('#prenom').attr('class', 'invalide');
    } else {
        $('#prenom_invalide').html('');
        $('#prenom').removeAttr('class', 'invalide');
    }
};

function valider_specialite(specialite) {
    if(!valider_string(specialite)) {
        $('#specialite_invalide').html(ERREUR_STRING);
        $('#specialite').attr('class', 'invalide');
    } else {
        $('#specialite_invalide').html('');
        $('#specialite').removeAttr('class', 'invalide');
    }
};

function valider_string(string) {
    var regex = /^[a-zA-ZéÉèÈç\-]+$/;
    return regex.test(string);
};

function ajouter_pros() {
    var url = '/pros/';
    var sexe = Number($('#sexe').val()),
        nom = $('#nom').val(),
        prenom = $('#prenom').val(),
        specialite = $('#specialite').val(),
        rencontres_2014 = [],
        nombre_patients = 0,
        total_visites = 0;

    var json = {sexe : sexe,
                nom : nom,
                prenom : prenom,
                specialite : specialite,
                rencontres_2014 : rencontres_2014,
                nombre_patients : nombre_patients,
                total_visites : total_visites
    };

    $.ajax({
        url : url,
        type : 'POST',
        data : JSON.stringify(json),
        contentType : 'application/json',
        success : function(data) {
            alert('Le professionnel a été ajouté avec succès.');
            var id = data._id;
            window.location.replace('http://localhost:3000/pros/consulter/' + id);
        },
        error : function(err) {
            alert('Une erreur est survenue lors de la sauvegarde.');
        }
    });
};
