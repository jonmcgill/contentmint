Cmint.createOnSaveHook(function(data) {
    Cmint.Util.debug('ran onSave hook: send data to back end script');
    console.log(data);
})