Cmint.Hooks.runComponentHooks = function(event, element, data) {

    var Local = Cmint.Instance.Hooks.Local;
    var Global = Cmint.Instance.Hooks.Global;

    for (var hook in Global) {
        if (event === 'editing') {
            Global[hook].editing(element, data);
            Cmint.Util.debug('ran global component hook "'+hook+'" during editing')
        }
        if (event === 'cleanup') {
            Global[hook].cleanup(element, data);
            Cmint.Util.debug('ran global component hook "'+hook+'" during cleanup')
        }
    }

    if (data.hooks) {
        data.hooks.forEach(function(hookName) {
            if (Local.hasOwnProperty(hookName)) {
                if (event === 'editing') {
                    Local[hookName].editing(element, data);
                    Cmint.Util.debug('ran local component hook "'+hook+'" during editing')
                }
                if (event === 'cleanup') {
                    Local[hookName].cleanup(element, data);
                    Cmint.Util.debug('ran local component hook "'+hook+'" during cleanup')
                }
            }
        })
    }

}