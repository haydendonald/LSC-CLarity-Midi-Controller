/**
 * LSC CLarity Midi Controller
 * By Hayden Donald 2021
 * 
 * midiHandler.js - Handles the midi commands
 */

module.exports = {
    midi: require("midi"),
    input: {
        "port": undefined,
        "name": "",
        "connection": false
    },
    output: {   
        "port": undefined,
        "name": "",
        "connection": false
    },

    //Attempt to setup the midi functionality
    init: function(inputName, outputName) {
        this.input.port = new this.midi.Input();
        if(inputName != undefined && this.findInputId(inputName) != undefined) {
            this.input.port.openPort(this.findInputId(inputName));
            this.input.name = inputName;
        } else if(inputName !== undefined) {console.log("Failed to open midi input " + inputName);}

        this.output.port = new this.midi.Output();
        if(outputName != undefined && this.findOutputId(outputName) != undefined) {
            this.output.port.openPort(this.findOutputId(outputName));
            this.output.name = outputName;
        } else if(inputName !== undefined) {console.log("Failed to open midi output " + inputName);}
    },

    //Set the callback for incoming data
    setIncomingHandler: function(callback) {
        this.input.port.on("message", function (deltaTime, message) {
            callback(deltaTime, message);
        });
    },

    //Send a midi message to the output device
    sendMessage: function(message) {
        this.output.port.sendMessage(message);
    },

    findInputId: function(name) {
        for(var i = 0; i < this.input.port.getPortCount(); i++){
            if(this.input.port.getPortName(i) == name){
                return i;
            }
        }

        return undefined;
    },

    findOutputId: function(name) {
        for(var i = 0; i < this.output.port.getPortCount(); i++){
            if(this.output.port.getPortName(i) == name){
                return i;
            }
        }

        return undefined;
    },

    //Get the available inputs in format [<input>] = id
    getInputDevices: function() {
        var inputs = {};
        for(var i = 0; i < this.input.port.getPortCount(); i++) {
            inputs[this.input.port.getPortName(i)] = i;
        }
        return inputs;
    },

    //Get the available outputs in format [<output>] = id
    getOutputDevices: function() {
        var inputs = {};
        for(var i = 0; i < this.output.port.getPortCount(); i++) {
            inputs[this.output.port.getPortName(i)] = i;
        }
        return inputs;
    }
}