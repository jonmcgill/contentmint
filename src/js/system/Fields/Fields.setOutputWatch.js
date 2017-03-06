Cmint.Fields.setOutputWatch = function(component) {

    if (component.config.tokens) {
        component.$options.watch = {};
        component.config.tokens.forEach(function(token) {
            var source = token[Object.keys(token)[0]];
            component.$watch(
                function() {
                    if (component.config.fields) {
                        return component.config.fields.output[source];
                    }
                },
                function(newVal, oldVal) {
                    Cmint.Bus.$emit('outputUpdate', source);
                }
            )
        })
    }

}