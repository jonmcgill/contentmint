Cmint.Util.Tests = [];

Cmint.Util.test = function(name, fn) {
    Cmint.Util.Tests.push({
        name: name,
        fn: fn
    })
}

Cmint.Util.formatTestResult = function(result) {
    if (typeof(result) === 'object') {
        return JSON.stringify(result);
    } else {
        return result;
    }
}

Cmint.Util.runTests = function() {
    if (Cmint.Settings.config.tests) {
        Cmint.Util.Tests.forEach(function(test) {
            var result = test.fn();
            if (result[0]) {
                console.log('TEST: ' + test.name + ' -- Passed');
            } else {
                var expected = Cmint.Util.formatTestResult(result[1]);
                var got = Cmint.Util.formatTestResult(result[2]);
                console.error('TEST: ' + test.name + ' -- Failed');
                console.error('=> expected ' + expected);
                console.error('=> returned ' + got);
            }
        })
    }
}