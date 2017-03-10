Cmint.AppFn.undo = function() {
    
    if (this.previous) {
        this.changes--;
        this.stage = this.previous.prior.snapshot;
        Vue.nextTick(Cmint.Drag.updateContainers);
        
        if (this.previous.prior) {
            this.previous = Cmint.Util.copyObject(this.previous.prior);
        } else {
            this.previous = null;
        }
        Cmint.Util.debug('state reverted (current changes: ' + this.changes + ')');
        Cmint.App.save();
    }

    Cmint.Bus.$emit('toolbarDisabler', !this.changes);

}