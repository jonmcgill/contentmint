// Creates a tinymce editor post process.
// These will run on a tinymce editor instance after it has updated.
// Takes 'rootElem' of the inline editor (e.target)
Cmint.createEditorPostProcess = function(fn) {
    Cmint.Instance.Editor.PostProcesses.push(fn);
}