Cmint.showFields = function(component) {
    if (this.fieldsComponent) {
        this.fieldsComponent = null;
        Util.debug('closing field view for ' + component._name);
    } else {
        this.fieldsComponent = component;
        Util.debug('opening field view for ' + component._name);
    }
}