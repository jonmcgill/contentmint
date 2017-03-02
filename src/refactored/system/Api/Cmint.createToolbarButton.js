// Once someone is done editing content, your application will probably
// want to do something with all of the data via an ajax request to some route.
// Use this function to add a button to the toolbar that carries out 
// whatever you need it to carry out.
/* Options are:
    {
        text: 'button text',
        icon: 'fa-class' (uses font-awesome iconography),
        callback: function() {
            ** sky's the limit **
        }
    }
*/
Cmint.createToolbarButton = function(options) {
    Cmint.Instance.Toolbar.push(options)
}