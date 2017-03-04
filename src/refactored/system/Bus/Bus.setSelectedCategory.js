Cmint.Bus.setSelectedCategory = function(data) {

    Cmint.Bus.$on('selectedCategory', function(selection) {
        data.selectedCategory = selection;
        Cmint.Util.debug('selected the category "'+selection+'"');
    })

}