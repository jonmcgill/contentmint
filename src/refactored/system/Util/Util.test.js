Cmint.Util.Tests = [];

Cmint.Util.test = function(name, fn) {
    Cmint.Util.Tests.push({
        name: name,
        fn: fn
    })
}

Cmint.Util.runTests = function() {
    Cmint.Util.Tests.forEach(function(test) {
        var result = test.fn();
        console.log('TEST: ' + test.name + ' --> ' + result);
    })
}