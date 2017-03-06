Cmint.Util.uid = function(length) {
    var id = 'ID-', i = 1;
    while (i <= length) {
        id += i % 2 === 0
            ? String.fromCharCode(Cmint.Util.random(65, 90))
            : String.fromCharCode(Cmint.Util.random(48, 57));
        i++;
    }
    return id;
}