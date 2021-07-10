/**
 * LSC CLarity Midi Controller
 * By Hayden Donald 2021
 * 
 * cmdTouchHandler.js - Handles what functions the cmd touch will do
 */

module.exports = {
    debug: false,
    midi: require("./midiHandler.js"),
    config: require("nconf"),
    configLocation: "./cmdTouchConf.json",
    midiConf: {
        type: {
            button: 144
        },
        buttons: {
            //The start (left most) id for the grid rows
            grid: [24, 36, 48, 60, 72, 84, 96, 108]
        },
        colours: {
            "off": 0,
            "redDim": 1,
            "redBright": 3,
            "greenDim": 16,
            "greenBright": 49,
            "yellowDim": 17,
            "yellowBright": 127
        }
    },
    gridButtonCallbacks: {},
    
    /**
     * Add a callback for a grid button press. Callback has parameter "pressed/released"
     * Top left is 0,0. Bottom right is 7,7
     **/
    addButtonGridCallback: function(row, col, callback) {
        if(this.gridButtonCallbacks[row + "x" + col] === undefined) {
            this.gridButtonCallbacks[row + "x" + col] = [];
        }
        this.gridButtonCallbacks[row + "x" + col].push(callback);
    },

    //Process the incoming grid buttons
    processGridButton: function(id, message) {
        var row = undefined;
        var col = undefined;
        for(var i = 0; i < this.midiConf.buttons.grid.length; i++) {
            if(id >= this.midiConf.buttons.grid[i] && id < this.midiConf.buttons.grid[i] + 8) {
                row = i;
                col = parseInt(id - this.midiConf.buttons.grid[i]);
            }
        }
        if(row != undefined && col != undefined) {
            if(this.debug) {
                console.log("Grid [" + row + ", " + col + "] " + (message[2] == 127 ? " Pressed" : " Released"));
            }

            //Process the callbacks
            if(this.gridButtonCallbacks[row + "x" + col] !== undefined) {
                for(var i = 0; i < this.gridButtonCallbacks[row + "x" + col].length; i++) {
                    this.gridButtonCallbacks[row + "x" + col][i]((message[2] == 127 ? "pressed" : "released"));
                }
            }
        }
    },

    //Set a colour to a grid button
    setGridButtonColor: function(row, col, colour) {
        this.midi.sendMessage([144, this.midiConf.buttons.grid[row] + col, this.midiConf.colours[colour]]);
    },

    //Set all the buttons to a color
    setAllButtonsColor: function(color) {
        //Grid
        for(var i = 0; i < 8; i++) {
            for(var j = 0; j < 8; j++) {
                this.setGridButtonColor(i, j, this.midiConf.colours[color]);
            }
        }
    },

    //Do a startup animation
    doStartupAnimation: function() {
        var self = this;
        //Send color after a timeout
        var sendColour = function(row, col, color, delay) {
            setTimeout(function() {
                self.setGridButtonColor(row, col, color);
            }, delay);
        }

        var colours = Object.keys(this.midiConf.colours);
        for(var i = 0; i < 8; i++) {
            for(var j = 0; j < 8; j++) {
                for(var k = 0; k < colours.length; k++) {
                    sendColour(i, j, colours[k], (k * 100) + (i * 100) + (j * 100));
                }
            }
        }
    },

    init: function(success) {
        console.log("Setup CMD Touch");
        this.midi.init();
        var config = this.config.use("file", {file: this.configLocation});
        
        //Attempt to load in config
        config.load();
        var error = false;
        if(config.get("inputDevice") === undefined || config.get("inputDevice") == "") {config.set("inputDevice", ""); error = true;}
        if(config.get("outputDevice") === undefined || config.get("outputDevice") == "") {config.set("outputDevice", ""); error = true;}

        if(error) {
            console.log("Invalid configuration for the cmdTouch");     

            //Save the file
            config.save(function (error) {
                if(error){console.log("An error occurred saving the cmdTouch config file: " + error.message);}
            });
            success(false);
        }
        else {  
            var self = this;      
            this.midi.init(config.get("inputDevice"), config.get("outputDevice"));
            this.midi.setIncomingHandler(function(deltaTime, message) {
                self.processGridButton(message[1], message);
               // console.log(`m: ${message} d: ${deltaTime}`);
            });

            //Set off
            this.setAllButtonsColor("off");

            setInterval(function() {
                self.doStartupAnimation();
            }, 1000);
            success(true);
        }
    }
}