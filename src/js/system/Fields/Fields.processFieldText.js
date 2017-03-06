Cmint.Fields.processFieldText = function(instance) {

    var fieldData = instance.fields[instance.field.name];
    var input = instance.field.inputs[fieldData.input];
    var compUid = instance.component.fields.uid;
    var component = Cmint.Fields.UIDS[compUid];

    // tokenize
    if (component.config.tokens) {
        input = Cmint.Fields.tokenize(input, component.config);
    }

    // run check function
    if (instance.field.check && input !== '') {
        instance.pass = !!input.match(instance.field.check);
        Cmint.Util.debug('field passed - ' + instance.pass);
    }

    // run user-defined field processes
    if (instance.field.processes) {
        instance.field.processes.forEach(function(fn) {
            input = Cmint.Instance.Fields.Processes[fn](input);
            Cmint.Util.debug('ran "'+fn+'" field process')
        })
    }

    // send to declared output
    component.config.fields.output[instance.field.result] = input;

}