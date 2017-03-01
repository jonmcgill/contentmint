Cmint.Sync.fn = (function() {
    
    // Takes a child and parent DOM element pair and returns
    // the index of the child within the parent.    
    function getContainerPosition(child, parent) {
        var position = null;
        $(parent).children().each(function(i) {
            if (this === child) {
                position = i;
            }
        })
        return position;
    }
    Cmint.Util.test('Cmint.Sync.fn.getContainerPosition', function() {
        var parent = $('<div></div>').append('<span></span>');
        var child = $('<p></p>');
        parent.append(child);

        return getContainerPosition(child[0], parent) === 1 ? 'Passed': 'Failed';
    })
    

    return {
        getContainerPosition: getContainerPosition
    }

})()