var nconf = require("nconf");
//var cmdTouch = require("./cmdTouchHandler.js");
var oscHandler = require("./oscHandler.js");
var bpmEngine = require("./bpm.js");

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

// var success = true;
// cmdTouch.init(actions, function(result) {
//     if(result == false){success = false;}
// });

// if(success == false) {
//     console.log("---------------------");
//     console.log("Something happened while trying to initialize. Please check the relevant configuration files..\nThe following devices are connected via MIDI:");
//     console.log("Inputs:");
//     for(var i in cmdTouch.midi.getInputDevices()) {
//         console.log(i);
//     }
//     console.log("\nOutputs:");
//     for(var i in cmdTouch.midi.getOutputDevices()) {
//         console.log(i);
//     }
// }



// var global = bpmEngine.create(60, 0, true);
// var bpm1 = bpmEngine.create(30, 0, true);
// var bpm2 = bpmEngine.create(30, 60, true);

// bpm1.setGlobalMetronome(global);
// bpm2.setGlobalMetronome(global);

// setTimeout(function(){global.setBPM(120);}, 5000);

// // const readline = require("readline");
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// setTimeout(function() {
//     global.setBPM(120);
// }, 3000);

// // bpm1.setBPM(60);
// // bpm2.setBPM(120);

// // bpm1.start();
// // bpm2.start();



// // bpm1.start();

// bpm1.setBPMCallback(function() {
//     console.log("BPM1");
//     //console.log(bpm1.currentBPM);
// });
// bpm2.setBPMCallback(function() {
//     console.log("BPM2");
//     //console.log(bpm1.currentBPM);
// });


// rl.on("line", function(){
//     bpm1.resync();
//     bpm2.resync();
// });

// console.log(bpm1);

// setInterval(function() {
//     bpm1.tap();
// }, 1000);

// console.log(bpm1);
// bpm1.setBPM(128);

// console.log(bpm2);
// bpm1.start();





// cmdTouch.addButtonGridCallback(0, 1, function(state) {
//     if(state == "pressed") {
//         console.log("LOLLLL");
//     }
// });