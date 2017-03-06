// Allows us to log lots of stuff to the console for debugging purposes and then
// remove it all
Cmint.Util.debug = function(message) {
    if (Cmint.Settings.config.debug) {
        console.log('DEBUG: ' + message);
    }
}