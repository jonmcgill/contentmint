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
        callback: function(toolbar, config) { // toolbar = DOM, config = these options
            ** sky's the limit **
        }
    }

    * Note 1: if 'disable' is set to true, the button's disable attribute can be toggled 
      by emitting 'toolbar-disabler' with a value of true or false

    * Note 2: if you'd like the button to look different, just add a class and style it yourself.
      If you want to use the theme's version, assign 'toolbar-btn-fancy' as true in btnClasses.

    * Note 3: if the button toggles state rather than just performing an action, you can toggle
      the active statue of the button by adding 'active' to the list of btnClasses. Then, in the
      click callback, you can do config.btnClasses.active = !config.btnClasses.active

*/
Cmint.createToolbarButton = function(options) {
    Cmint.Ui.Toolbar.push(options)
}

// Default buttons
Cmint.createToolbarButton({
    text: 'Save',
    btnClasses: { 'toolbar-save': true },
    iconClasses: { 'fa': true, 'fa-save': true },
    callback: function(button) {
        Cmint.App.save();
    }
})

Cmint.createToolbarButton({
    text: 'Context',
    btnClasses: { 'toolbar-context': true, 'active': false },
    iconClasses: { 'fa': true, 'fa-object-ungroup': true },
    callback: function(toolbar, config) {
        config.btnClasses.active = !config.btnClasses.active;
        Cmint.Bus.$emit('contextualize');
        Cmint.Util.debug('Contextualizing stage components');
    }
})

Cmint.createToolbarButton({
    text: 'Undo',
    btnClasses: { 'toolbar-undo': true },
    iconClasses: { 'fa': true, 'fa-undo': true },
    disable: null,
    callback: function() {
        Cmint.App.undo();
    }
})