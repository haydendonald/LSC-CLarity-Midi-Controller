var nconf = require("nconf");
//var cmdTouch = require("./cmdTouchHandler.js");
var oscHandler = require("./oscHandler.js");
var APCMiniHandler = require("./APCMiniHandler.js");
var midiHandler = require("./midiHandler.js");
//var bpmEngine = require("./bpm.js");
var inquirer = require('inquirer');
var osc = require("osc");
var udpPort;
var oscCallbacks = [];

var settings = {
    osc: {
        listenPort: 8000,
        sendPort: 9000,
        sendIP: "127.0.0.1"
    }
}

//Send to OSC
function sendOSC(address, args) {
    if (typeof args != "object") {
        if (typeof args == "string") {
            args = [
                {
                    type: "s",
                    value: args
                }
            ]
        }
        else if (typeof args == "number") {
            if (args % 1 === 0) {
                args = [
                    {
                        type: "i",
                        value: args
                    }
                ]
            }
            else {
                args = [
                    {
                        type: "f",
                        value: args
                    }
                ]
            }
        }
        else {
            console.log("ERROR: Unknown OSC type");
        }
    }

    //Send it!
    udpPort.send({
        address: address,
        args: args,
    }, settings.osc.sendIP, settings.osc.sendPort);
}



//The basic actions that can be taken
var actions = {
    /**
     * Print a message to the console
     * command = debug
     * parameter = <message>
     */
    "debug": {
        name: "Debug",
        description: "Display a debug message",
        action: function (message) {
            console.log(parameter);
        }
    },
    //Call a go on a cuelist
    "cuelistGo": {
        name: "Cuelist Go",
        description: "Perform a go action on a cuelist",
        action: function (params) {
            sendOSC("/cuelist/go", params.cuelist);
        },
        configOptions: [{
            message: "Cuelist name",
            name: "cuelist",
            default: "cuelist",
        }]
    },
    //Call a go on a cuelist with a specific cue
    "cuelistGoCue": {
        name: "Cuelist Go Cue",
        description: "Call go on a cuelist with a specific cue number",
        action: function (params) {
            sendOSC("/cuelist/go", [
                {
                    type: "s",
                    value: params.cuelist
                },
                {
                    type: "i",
                    value: parseInt(params.cue)
                }
            ]);
        },
        configOptions: [{
            message: "Cuelist name",
            name: "cuelist",
            default: "cuelist",
        },
        {
            message: "Cue number",
            name: "cue",
            default: "1",
        }]
    },
    // "cuelistPauseBack": function (cuelistName) {
    //     sendOSC("/cuelist/pauseback", cuelistName);
    // },
    // "cuelistSkipNext": function (cuelistName) {
    //     sendOSC("/cuelist/skipnext", cuelistName);
    // },
    // "cuelistSkipPrev": function (cuelistName) {
    //     sendOSC("/cuelist/skipprev", cuelistName);
    // },
    // "cuelistRelease": function (cuelistName) {
    //     sendOSC("/cuelist/release", cuelistName);
    // },
    // "cuelistSetFlash": function (cuelistName, cueNumber) {
    //     sendOSC("/cuelist/setflash", [
    //         {
    //             type: "s",
    //             value: cuelistName
    //         },
    //         {
    //             type: "i",
    //             value: parseInt(cueNumber)
    //         }
    //     ]);
    // },
    // "cuelistSetFader": function (cuelistName, level) {
    //     sendOSC("/cuelist/setfader", [
    //         {
    //             type: "s",
    //             value: cuelistName
    //         },
    //         {
    //             type: "f",
    //             value: level
    //         }
    //     ]);
    // },
    // "setGM": function (level) {
    //     sendOSC("/setgrandmaster", level);
    // },
    // "releaseAll": function () {
    //     sendOSC("/releaseall");
    // },
}

var success = true;
APCMiniHandler.init(actions, inquirer, function (result) {
    if (result == false) { success = false; }
});

if (success == false) {
    console.log("---------------------");
    console.log("Something happened while trying to initialize. Please check the relevant configuration files..\nThe following devices are connected via MIDI:");
    console.log("Inputs:");
    for (var i in midiHandler.getInputDevices()) {
        console.log(i);
    }
    console.log("\nOutputs:");
    for (var i in midiHandler.getOutputDevices()) {
        console.log(i);
    }
}
else {
    //Setup OSC
    udpPort = new osc.UDPPort({
        localAddress: "0.0.0.0",
        localPort: settings.osc.listenPort,
        metadata: true
    });

    // Listen for incoming OSC messages.
    udpPort.on("message", function (oscMsg, timeTag, info) {
        for (var i in oscCallbacks) {
            oscCallbacks[i](oscMsg, timeTag, info);
        }
        // console.log("An OSC message just arrived!", oscMsg);
        // console.log("Remote info is: ", info);
    });

    // Open the socket.
    udpPort.open();


    // When the port is read, send an OSC message to, say, SuperCollider
    udpPort.on("ready", function () { });

    // //Learn
    // APCMiniHandler.learn(function () {
    //     APCMiniHandler.init(actions, inquirer, function (result) {
    //         console.log("Updated successfully!");
    //     });
    // });
}