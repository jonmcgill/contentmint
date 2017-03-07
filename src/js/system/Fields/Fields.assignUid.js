// Some field processes need to hold on to specific component data so that when that data
// mutates, they can run and update any tokens that may have been used. Because Vue creates
// new instances of component data on mount and update, those data sets were being eliminated
// and the field processes would be updating data that was no longer attached to anything.
// With field uids, all field processing will be sent to whatever component is referenced by
// Fields.UIDS.
Cmint.Fields.assignUid = function(component) {

    var uid;

    if (component.config.fields &&
        component.environment === 'stage' &&
        !component.config.fields.uid || component.config.copy) {

        uid = Cmint.Util.uid(12);
        while (Cmint.Fields.UIDS.hasOwnProperty(uid)) {
            uid = Cmint.Util.uid(12);
        }
        component.config.fields.uid = uid;
        Cmint.Util.debug('assigned field uid "'+uid+'" to component at [' + component.config.index + ']');

        if (component.config.copy) {
            component.config.copy = false;
        }

    }

    // If a custom component is being added, its components may already have field uids.
    // If that is the case, check if that uid exists in Cmint.Fields.UIDS. If so, generate
    // a new uid, add it to UIDS, and assign it to the component.
    if (component.config.fields.uid) {
        if (Cmint.Fields.UIDS.hasOwnProperty(uid)) {
            component.config.fields.uid = Cmint.Util.uid(12);
        }
        Cmint.Fields.UIDS[component.config.fields.uid] = component;
    }

}