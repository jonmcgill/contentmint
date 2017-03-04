Cmint.AppFn.mergeCustomComponents = function(data) {
    
    if (data.customComponents.length > 0) {

        data.components = data.components.concat(data.customComponents);
        Cmint.Bus.$emit('updateComponentList', data.components);

    }

}