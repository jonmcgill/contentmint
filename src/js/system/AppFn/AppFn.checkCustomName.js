Cmint.AppFn.checkCustomName = function(customModal) {
    
    var double = 'pass';

    // If no name, render error
    if (customModal.name === '') {
        customModal.nameError = 'Name field is blank';
        customModal.hasError = true;
        return 'blank';
    }

    // Find any duplicate names
    Cmint.App.components.forEach(function(component) {
        if (component.display === customModal.name) {
            double = 'fail';
        }
    })

    return double;

}