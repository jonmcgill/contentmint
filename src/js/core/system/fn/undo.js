Cmint.undo = function() {
    if (this.previous) {
        this.changes--;
        this.stage = this.previous.prior.snapshot;
        Vue.nextTick(Drag.updateContainers);
        this.previous = this.previous.prior;
        if (!this.previous.prior) {
            this.previous = null;
        }
        Util.debug('state reverted (current changes: ' + this.changes + ')');
    } else {
        Util.debug('nothing to undo');
    }
}