// Returns a copy of component data from the main Vue instance when given
// an array path that mirrors the location of the component in a nested data
// tree (from getStagePosition)
// position = array path to data object
// environment = array of component objects (stage or thumbnails)
Cmint.Sync.getComponentData = function(position, environment) {

    var data = Cmint.Util.copyObject(environment);

    // remove the first item since that is provided by the environment
    position.shift();

    position.forEach(function(key, i) {
        if (typeof(key) === 'string') {
            data = data.contexts[key];
        } else {
            data = data[key];
        }
    })

    return data;

}

Cmint.Util.test('Cmint.Sync.getComponentData', function() {

    var environment = {
        foo: [ null, {
            contexts: {
                bar: [ null, { 
                    baz: 'tada'
                }]
            }
        }]
    }
    var position = ['foo', 1, 'bar', 1];
    var expected = { baz: 'tada' };
    var got = Cmint.Sync.getComponentData(position, environment.foo);
    var result = _.isEqual(expected, got);

    return [result, expected, got];

})