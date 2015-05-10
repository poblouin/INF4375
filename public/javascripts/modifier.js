$(document).ready(function() {
    $('#sexe').on('input', function() {
        var sexe = $('#sexe').val();
        valider_sexe(sexe);
    });

    $('#sexe').change(function() {
        $('#sexe_confirme').html('');
    });

    $('#nom').on('input', function() {
        var nom = $('#nom').val();
        valider_nom(nom);
    });

    $('#nom').change(function() {
        $('#nom_confirme').html('');
    });

    $('#prenom').on('input', function() {
        var prenom = $('#prenom').val();
        valider_prenom(prenom);
    });

    $('#prenom').change(function() {
        $('#prenom_confirme').html('');
    });

    $('#specialite').on('input', function() {
        var specialite = $('#specialite').val();
        valider_specialite(specialite);
    });

    $('#specialite').change(function() {
        $('#specialite_confirme').html('');
    });
});

var ERREUR_STRING = 'Le champ doit contenir au moins un caractère et doit contenir seulement des lettres.';
var VALIDE = 'Données sauvegardées.';

function valider_sexe(sexe) {
    var regex = /^[1-2]$/;

    if(!regex.test(sexe)) {
        $('#sexe_confirme').css('color', 'red');
        $('#sexe_confirme').html('Les valeurs acceptées sont : 1 pour un homme et 2 pour une femme.');
        $('#sexe').attr('class', 'invalide');
    } else {
        $('#sexe_confirme').css('color', 'green');
        $('#sexe_confirme').html(VALIDE);
        $('#sexe').removeAttr('class', 'invalide');

        var data = {sexe : Number(sexe)};
        sauvegarder_pros(data);
    }
};

function valider_nom(nom) {
    if(!valider_string(nom)) {
        $('#nom_confirme').css('color', 'red');
        $('#nom_confirme').html(ERREUR_STRING);
        $('#nom').attr('class', 'invalide');
    } else {
        $('#nom_confirme').css('color', 'green');
        $('#nom_confirme').html(VALIDE);
        $('#nom').removeAttr('class', 'invalide');

        var data = {nom : nom};
        sauvegarder_pros(data);
    }
};

function valider_prenom(prenom) {
    if(!valider_string(prenom)) {
        $('#prenom_confirme').css('color', 'red');
        $('#prenom_confirme').html(ERREUR_STRING);
        $('#prenom').attr('class', 'invalide');
    } else {
        $('#prenom_confirme').css('color', 'green');
        $('#prenom_confirme').html(VALIDE);
        $('#prenom').removeAttr('class', 'invalide');

        var data = {prenom : prenom};
        sauvegarder_pros(data);
    }
};

function valider_specialite(specialite) {
    if(!valider_string(specialite)) {
        $('#specialite_confirme').css('color', 'red');
        $('#specialite_confirme').html(ERREUR_STRING);
        $('#specialite').attr('class', 'invalide');
    } else {
        $('#specialite_confirme').css('color', 'green');
        $('#specialite_confirme').html(VALIDE);
        $('#specialite').removeAttr('class', 'invalide');

        var data = {specialite : specialite};
        sauvegarder_pros(data);
    }
};

function valider_string(string) {
    var regex = /^[a-zA-ZéÉèÈç\-]+$/;
    return regex.test(string);
};

function sauvegarder_pros(data) {
    var id = $('#id').val();
    var url = '/pros/' + id;

    $.ajax({
        url : url,
        type : 'PUT',
        data : JSON.stringify(data),
        contentType : 'application/json',
        error : function(err) {
            alert('Une erreur est survenue lors de la sauvegarde.');
        }
    });
};

function supprimer_pros() {
    var supprime = confirm('Voulez-vous vraiment supprimer ce professionel?');

    if(supprime) {
        var id = $('#id').val();
        var url = '/pros/' + id;

        $.ajax({
            url : url,
            type : 'DELETE',
            success : function(data) {
                alert('Le professionnel a été supprimé.');
                window.location.replace('http://localhost:3000/');
            },
            error : function(err) {
                alert('Il est impossible de supprimer un professionnel s\'il a eu des visites en 2014.');
            }
        });
    }
};
