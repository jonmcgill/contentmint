// Field processes will take field inputs after they have been run
// through the token system, mutate the value in some way, and return
// it to be stored in the field output.
// Keep in mind that some fields may use tokens based on content regions
// so every time tinymce triggers a change these processes will run.
Cmint.createFieldProcess = function(name, fn) {
    if (Cmint.Instance.Fields.Processes[name]) {
        console.error('Field process "'+name+'" already exists')
    } else {
        Cmint.Instance.Fields.Processes[name] = fn;
    }
}