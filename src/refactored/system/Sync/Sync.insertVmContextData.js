// Takes data and inserts it into the spot that the position points to within
// a given environment.
Cmint.Sync.insertVmContextData = function(position, data, environment) {

    var context = environment,
        currentContext = Cmint.Sync.getVmContextData(position, context);

        currentContext.context.splice(currentContext.index, 0, data);

    return environment;

}

Cmint.Util.test('Cmint.Sync.insertVmContextData', function() {

    var context = {
        foo: [
            { biz: 'boo' },
            { bar: [
                { buz: 'byz' },
                { baz: 'tada' }
            ]}
        ]}
    var position = ['foo', 1, 'bar', 2];
    var data = { beez: 'bundle' };
    var expected = {
        foo: [
            { biz: 'boo' },
            { bar: [
                { buz: 'byz' },
                { baz: 'tada' },
                { beez: 'bundle' }
            ]}
        ]}
    var got = Cmint.Sync.insertVmContextData(position, data, context);
    var result = _.isEqual(expected, got);

    return [result, expected, got];

})