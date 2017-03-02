// Once someone is done editing content, your application will probably
// want to do something with all of the data via an ajax request to some route.
// Use this function to add a button to the toolbar that carries out 
// whatever you need it to carry out.
/* Options are:
    {
        text: 'button text',
        btnClasses: { 'toolbar-save': true }
        iconClasses: {'fa': true, 'fa-save': true },
        disable: true,                                  
        callback: function() {
            ** sky's the limit **
        }
    }

    * Note 1: if 'disable' is set to true, the button's disable attribute can be toggled 
      by emitting 'toolbar-disabler' with a value of true or false

    * Note 2: if you'd like the button to look different, just add a class and style it yourself.
      If you want to use the theme's version, assign 'toolbar-btn-fancy' as true in btnClasses.

*/
Cmint.createToolbarButton = function(options) {
    Cmint.Ui.Toolbar.push(options)
}

// Default buttons
Cmint.createToolbarButton({
    text: 'Save',
    btnClasses: { 'toolbar-save': true },
    iconClasses: { 'fa': true, 'fa-save': true },
    callback: function() {
        Cmint.Util.debug('content saved');
    }
})

Cmint.createToolbarButton({
    text: 'Context',
    btnClasses: { 'toolbar-context': true },
    iconClasses: { 'fa': true, 'fa-object-ungroup': true },
    callback: function() {
        Cmint.Util.debug('Contextualizing stage components');
    }
})

Cmint.createToolbarButton({
    text: 'Undo',
    btnClasses: { 'toolbar-undo': true },
    iconClasses: { 'fa': true, 'fa-undo': true },
    disable: true,
    callback: function() {
        Cmint.Util.debug('Reverting most recent change');
    }
})