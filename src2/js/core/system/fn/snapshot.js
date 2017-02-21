Cmint.snapshot = function() {
    this.changes++;
    var shot = Util.copy(this.stage);
    Util.debug('snapshot taken (current changes: ' + this.changes + ')');
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
}