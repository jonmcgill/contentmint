Cmint.AppFn.getComponentMarkup = function(component) {

    var $el = $(component.$el);
    var $clone = $el.clone();
    var $wrap = $('<div></div>');
    $clone.appendTo($wrap);

    // Run component cleanup hooks now
    Cmint.Hooks.runComponentHooks('cleanup', $clone[0], component.config);

    // Run Contentmint system cleanup
    $wrap.find(Cmint.Settings.attr.dataEdit).removeAttr(Cmint.Settings.name.dataEdit)
    $wrap.find(Cmint.Settings.attr.dataTemp).removeAttr(Cmint.Settings.name.dataTemp)
    $wrap.find('[contenteditable]').removeAttr('contenteditable')
    $wrap.find('[spellcheck]').removeAttr('spellcheck')
    $wrap.find(Cmint.Settings.class.component).removeClass(Cmint.Settings.name.component + ' ' + 'active')
    $wrap.find('.mce-content-body').removeClass('mce-content-body');
    $wrap.find('[id]').each(function() {
        if ($(this).attr('id').match(/^mce_\d+/)) $(this).removeAttr('id');
    })
    $wrap.find('[class]').each(function() {
        if ($(this).attr('class') === '') $(this).removeAttr('class');
    })

    var markup = $wrap.html();

    // Run markup hooks now
    Cmint.Hooks.runComponentHooks('markup', markup, component.config);

    Cmint.Util.debug('got markup for component "'+component.config.name+'"');

}