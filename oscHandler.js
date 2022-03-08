/**
 * LSC CLarity Midi Controller
 * By Hayden Donald 2021
 * 
 * oscHandler.js - Handles the OSC communications to CLarity
 */

 module.exports = {

    //The supported osc functions with params passed
    funcs: {
        "cuelistGo": function(parameter, buttonCallback, faderCallback) {
            console.log(parameter);
            buttonCallback("brightRed");
        },
    }

 }