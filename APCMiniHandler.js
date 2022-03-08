/**
 * LSC CLarity Midi Controller
 * By Hayden Donald 2022
 * 
 * APCMiniHandler.js - The handle for the APC mini
 */

module.exports = {
    midi: require("./midiHandler.js"),
    config: require("nconf"),
    configLocation: "./apcMiniConfig.json",
    inquirer: undefined,
    midiConf: {
        buttonBankRows: [56, 48, 40, 32, 24, 16, 8, 0],
        buttonCols: 8,
        extraButtons: [64, 65, 66, 67, 68, 69, 70, 71, 82, 83, 84, 85, 86, 87, 88, 89],
        shiftButton: 98,
        colours: {
            "off": 0,
            "green": 1,
            "flashingGreen": 2,
            "red": 3,
            "flashingRed": 4,
            "yellow": 5,
            "flashingYellow": 6
        }
    },
    buttonCallbacks: {},

    //Possible actions
    actions: {},

    //Set a colour to a button
    setButtonColor: function (button, colour) {
        this.midi.sendMessage([144, button, this.midiConf.colours[colour]]);
    },

    //Flash the button
    flashButton: function(id, flashColor, previousColor) {
        var self = this;
        self.setButtonColor(id, flashColor);
        setTimeout(function() {
            self.setButtonColor(id, previousColor);
        }, 200);
    },

    //Init the midi controller
    init: function (actions, inquirer, result) {
        console.log("Setup APC Mini");
        this.midi.init();
        this.inquirer = inquirer;
        var config = this.config.use("file", { file: this.configLocation });

        //Copy the base functions to our functions
        for (var i in actions) {
            this.actions[i] = actions[i];
        }

        //Attempt to load in config
        config.load();
        var error = false;
        if (config.get("inputDevice") === undefined || config.get("inputDevice") == "") { config.set("inputDevice", ""); error = true; }
        if (config.get("outputDevice") === undefined || config.get("outputDevice") == "") { config.set("outputDevice", ""); error = true; }

        if (error) {
            console.log("Invalid configuration for the APC Mini");

            //Save the file
            config.save(function (error) {
                if (error) { console.log("An error occurred saving the APC Mini config file: " + error.message); }
            });
            result(false);
        }
        else {
            var self = this;
            this.midi.init(config.get("inputDevice"), config.get("outputDevice"));

            //Set the grid button actions
            for (var i = 0; i < this.midiConf.buttonBankRows.length; i++) {
                self.buttonCallbacks[i] = [];
                for (var j = 0; j < this.midiConf.buttonCols; j++) {
                    var id = this.midiConf.buttonBankRows[i] + j;
                    self.setButtonColor(id, "off");

                    //Assign the button actions
                    var curr = config.get(`${id}_action`);
                    if (curr !== undefined) {
                        self.setButtonColor(id, curr.defaultColor);
                        self.buttonCallbacks[id] = function (id, curr) {
                            return function (message, deltaTime) {
                                if (message[0] == 144) {
                                    try {
                                        self.actions[curr.action].action(curr.params);

                                        //Flash?
                                        self.flashButton(id, curr.flashColor, curr.defaultColor);
                                    }
                                    catch (e) {console.log(e); console.log(`${curr.action} is not a valid action`); }

                                }
                            }
                        }(id, curr);
                    }
                }
            }

            //Set the other button actions
            for (var i = 0; i < this.midiConf.extraButtons.length; i++) {
                var id = this.midiConf.extraButtons[i];
                self.setButtonColor(id, "off");

                //Assign the button actions
                self.buttonCallbacks[id] = function (i) {
                    return function (message, deltaTime) {
                        //self.actions["cuelistGoCue"].action("test", "2");
                    }
                }(i);
            }

            self.setButtonColor(self.midiConf.shiftButton, "red");

            //Set the incoming handles for midi
            this.midi.setIncomingHandler(function (deltaTime, message) {
                try {
                    self.buttonCallbacks[message[1]](message, deltaTime);
                } catch (e) { }
                //console.log(`m: ${message} d: ${deltaTime}`);
            });

            result(true);
        }
    },

    //Learn actions and set in the config file
    learn: function (callback) {
        var self = this;
        console.log("-------------------------------------------------");
        console.log("APC Mini Learning Mode!");
        console.log("Press the button(s) you wish to set an action to");
        console.log("To save the actions press the SHIFT button");

        //Assign the callbacks
        for (var id in this.buttonCallbacks) {
            self.buttonCallbacks[id] = function (id) {
                return function (message, deltaTime) {
                    if (message[0] == 144) {
                        self.setButtonColor(id, "flashingYellow");
                        var choices = [];
                        for (var i in self.actions) {
                            choices.push({
                                name: self.actions[i].name,
                                value: i
                            });
                        }
                        self.inquirer.prompt([{
                            type: "list",
                            message: "Please select an action you would like this button to perform",
                            name: "action",
                            choices: choices,
                        }]).then(answers => {
                            self.inquirer.prompt(self.actions[answers.action].configOptions).then(params => {
                                self.config.set(`${id}_action`, {
                                    action: answers.action,
                                    params: params,
                                    flashColor: "yellow",
                                    defaultColor: "green"
                                });
                                self.setButtonColor(id, "green");
                                console.log("Set!");
                            });
                        });
                    }
                }
            }(id);
        }

        //Assign the shift button to reset the callbacks
        self.buttonCallbacks[self.midiConf.shiftButton] = function (message, deltaTime) {
            console.log("Save!");
            self.config.save(function (error) {
                if (error) { console.log("An error occurred saving the APC Mini config file: " + error.message); }
            });
            self.midi.close();
            callback();
        }
    }
}