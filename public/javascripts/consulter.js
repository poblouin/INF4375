$(document).ready(function() {
    afficher_pros();
});

function afficher_pros() {
    var id = $('#pros').val();
    var url = '/pros/' + id;

    $.getJSON(url, function(pros) {
        $('#sexe').val(pros.sexe);
        $('#nom').val(pros.nom);
        $('#prenom').val(pros.prenom);
        $('#specialite').val(pros.specialite);
        $('#nombre_patients').val(pros.nombre_patients);
        $('#total_visites').val(pros.total_visites);

        var rencontres_2014 = pros.rencontres_2014;
        var table_rencontres = '';

        for(var i = 0; i < rencontres_2014.length; i++) {
            var rencontre = rencontres_2014[i];

            table_rencontres += '<tr>';
            table_rencontres += '<td>' + rencontre.nom + '</td>';
            table_rencontres += '<td>' + rencontre.prenom + '</td>';
            table_rencontres += '<td>' + rencontre.id + '</td>';
            table_rencontres += '</tr>';
        }
        $('#pros table tbody').html(table_rencontres);
    });
};
