Cmint.AppFn.undo = function() {
    
    if (this.previous) {
        this.changes--;
        this.stage = this.previous.prior.snapshot;
        Vue.nextTick(Cmint.Drag.updateContainers);
        this.previous = this.previous.prior;
        if (!this.previous.prior) {
            this.previous = null;
        }
        Cmint.Util.debug('state reverted (current changes: ' + this.changes + ')');
        Cmint.App.save();
    }

    Cmint.Bus.$emit('toolbarDisabler', !this.changes);

}