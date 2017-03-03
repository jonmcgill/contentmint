Cmint.Ui.contextualize = function() {

    Cmint.Bus.$on('contextualize', function() {

        Cmint.App.contextualize = !Cmint.App.contextualize;

    })

}