Cmint.Fields.processFieldText = function(instance) {

    var fieldData = instance.fields[instance.field.name];
    var input = instance.field.inputs[fieldData.input];

    // tokenize
    if (instance.component.tokens) {
        input = Cmint.Fields.tokenize(input, instance.component);
    }

    // run check function
    if (instance.field.check && input !== '') {
        instance.pass = !!input.match(instance.field.check);
        Cmint.Util.debug('field passed - ' + instance.pass);
    }

    // run user-defined field processes

    // send to declared output
    instance.component.fields.output[instance.field.result] = input;

}