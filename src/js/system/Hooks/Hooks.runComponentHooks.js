Cmint.Hooks.runComponentHooks = function(event, thing, data) {

    var Local = Cmint.Instance.Hooks.Local;
    var Global = Cmint.Instance.Hooks.Global;

    for (var hook in Global) {
        if (Global[hook][event]) {
            Global[hook][event](thing, data);
            Cmint.Util.debug('ran global component hook "'+hook+'" on event "'+event+'"')
        }
    }

    if (data.hooks) {
        data.hooks.forEach(function(hook) {
            if (Local.hasOwnProperty(hook)) {
                if (Local[hook][event]) {
                    Local[hook][event](thing, data);
                    Cmint.Util.debug('ran local component hook "'+hook+'" on event "'+event+'" for ' + data.name)
                }
            }
        })
    }

}