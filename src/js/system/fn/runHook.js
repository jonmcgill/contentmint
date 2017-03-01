Editor.runHook = function(component, event) {

    var elements = $(component.$el).find('[data-hook]');

    $(component.$el).find('[data-hook]').each(function() {
        var elem = this;
        var hooks = $(elem).attr('data-hook');
        hooks = hooks.split(',').map(function(item) {
            return item.trim();
        });
        hooks.forEach(function(hook) {
            Editor.hooks[hook][event](elem);
        });
        Util.debug('running component hook for ' + component.config._name);
    })

}