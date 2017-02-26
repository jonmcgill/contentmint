Cmint.save = function() {
    Bus.$emit('updateEditorData');
    this.saved = Util.copy(this.stage);
    Util.debug('saved content');
}