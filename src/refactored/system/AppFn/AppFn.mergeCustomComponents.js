Cmint.AppFn.mergeCustomComponents = function() {
    
    if (this.customComponents.length > 0) {

        this.components = this.components.concat(this.customComponents);
        Cmint.Bus.$emit('updateComponentList', this.components);

    }

}