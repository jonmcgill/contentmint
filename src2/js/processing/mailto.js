Cmint.createProcess('mailto', function(inputs, component) {

    var output = 'mailto:';

    output += Cmint.tokenize(inputs.to.value, component) + '?';
    output += encode(Cmint.tokenize(inputs.subject.value, component)) + '&';
    output += encode(Cmint.tokenize(inputs.body.value, component));

    function encode(val) { return encodeURIComponent(val); }

    return output;

})