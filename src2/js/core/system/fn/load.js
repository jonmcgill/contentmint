Cmint.load = function() {
    this.stage = Util.copy(this.saved);
    Vue.nextTick(Drag.updateContainers);
    Vue.nextTick(this.snapshot);
    Util.debug('loaded content');
}