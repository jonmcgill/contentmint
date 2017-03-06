// Whereas getComponentData returns a copy of the component object
// data, this function returns the actual Vm context and position for
// a given component. The Vm data is returned by reference so that it
// can be mutated (mostly for drag and drop scenarios)
// position = path array mirroring data location
// context = an array of component data objects
// -->
// {
//   context: the array housing the component data,
//   index: the index of the component data
// }
Cmint.Sync.getVmContextData = function(position, context) {

    var output,
        _position = Cmint.Util.copyObject(position),
        _context = context;

    _position.shift();

    _position.forEach(function(key, i) {
        if (i === (_position.length - 1)) {
            output = {
                context: _context,
                index: key
            }
        } else {
            if (typeof(key) === 'string') {
                _context = _context.contexts;
            }
            _context = _context[key]; 
        }
    })

    return output;

}

Cmint.Util.test('Cmint.Sync.getVmContextData', function() {

    var context = {
        foo: [null, {
            contexts: {
                bar: [null, {
                    baz: 'tada'
                }]
            }
        }]
    }
    var position = ['foo', 1, 'bar', 1];
    var expected = { 
        context: [null, {baz: 'tada'}],
        index: 1
    }
    var got = Cmint.Sync.getVmContextData(position, context.foo);
    var result = _.isEqual(got, expected);

    return [result, expected, got];

})