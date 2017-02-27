Editor.runHook = function(component, event) {

    var elements = $(component.$el).find('[data-hook]');

    $(component.$el).find('[data-hook]').each(function() {

        var hookName = $(this).attr('data-hook');
        var scoped = elements.filter(function() {
            return $(this).attr('data-hook') === hookName
        }).map(function() {
            return $(this).removeAttr('data-hook');
        })
        Editor.hooks[hookName][event](scoped);
        Util.debug('running component hook for ' + component.config._name);
    })

}