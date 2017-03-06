// Keeps track of changes made within in the editor as a whole. Note, this does
// not keep track of every tinymce editor instance change, only events directly related
// to components within the system. If you unfocuse an editor instance, that is
// technically a component change since its data is being updated.
Cmint.AppFn.snapshot = function() {

    this.changes++;

    var shot = Cmint.Util.copyObject(this.stage);
    Cmint.Util.debug('took project snapshot (changes: ' + this.changes + ')');

    if (!this.previous) {
        this.previous = {
            snapshot: shot,
            prior: {
                snapshot: [],
                prior: null
            }
        }
    } else {
        this.previous = {
            snapshot: shot,
            prior: this.previous
        }
    }

    Cmint.Bus.$emit('toolbarDisabler', !this.changes);

}