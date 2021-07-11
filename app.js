var nconf = require("nconf");
var cmdTouch = require("./cmdTouchHandler.js");
var oscHandler = require("./oscHandler.js");

//The basic actions that can be taken
var actions = {
    /**
     * Print a message to the console
     * command = debug
     * parameter = <message>
     */
        "debug": function(parameter, buttonCallback) {
        console.log(parameter);
    }
}

//TODO add the osc actions here

var success = true;
cmdTouch.init(actions, function(result) {
    if(result == false){success = false;}
});

if(success == false) {
    console.log("---------------------");
    console.log("Something happened while trying to initialize. Please check the relevant configuration files..\nThe following devices are connected via MIDI:");
    console.log("Inputs:");
    for(var i in cmdTouch.midi.getInputDevices()) {
        console.log(i);
    }
    console.log("\nOutputs:");
    for(var i in cmdTouch.midi.getOutputDevices()) {
        console.log(i);
    }
}

// cmdTouch.addButtonGridCallback(0, 1, function(state) {
//     if(state == "pressed") {
//         console.log("LOLLLL");
//     }
// });