Cmint.watchOutputUpdates = function(fieldComponent) {
    fieldComponent.$bus.$on('outputUpdate', function(output) {
        if (output !== fieldComponent.field.result) {
            fieldComponent.process();
        }
    })
}