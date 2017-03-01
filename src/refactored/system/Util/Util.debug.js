// Allows us to log lots of stuff to the console for debugging purposes and then
// remove it all
Cmint.Util.debug = function(message) {
    if (Cmint.G.debug_on) {
        console.log('DEBUG: ' + message);
    }
}