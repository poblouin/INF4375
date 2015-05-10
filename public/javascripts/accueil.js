$(document).ready(function() {
    construire_table_pros();
});

function construire_table_pros() {
    var table_pros = '';
    var url = '/pros/liste';

    $.getJSON(url, function(data) {
        data = trier(data, 'specialite');
        $.each(data, function() {
            table_pros += '<tr>';
            table_pros += '<td>' + this.specialite + '</td>';
            table_pros += '<td>' + this.nom + '</td>';
            table_pros += '<td>' + this.prenom + '</td>';
            table_pros += '<td><a href=/pros/consulter/' + this._id +'>Consulter</a></td>';
            table_pros += '</tr>';
        });
        $('#liste_pros table tbody').html(table_pros);
    });
};

function trier(liste, attr) {
    return liste.sort(function(a, b) {
        var x = a[attr].toLowerCase();
        var y = b[attr].toLowerCase();
        return x.localeCompare(y);
    });
};
