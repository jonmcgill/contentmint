Cmint.Fields.processFieldText = function(instance) {

    var fieldData = instance.fields[instance.field.name];
    var input = instance.field.inputs[fieldData.input];

    // tokenize
    if (instance.component.tokens) {
        input = Cmint.Fields.tokenize(input, instance.component);
    }

    // run check function
    if (instance.field.check && input !== '') {
        console.log(instance.field);
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
    instance.component.fields.output[instance.field.result] = input;

}