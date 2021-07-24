/**
 * LSC CLarity Midi Controller
 * By Hayden Donald 2021
 * 
 * bpm.js - Provides a bpm counter
 */

module.exports = {
    currentBPM: 0,
    active: false,
    intervalFn: undefined,
    beatCallbackFn: function(){},

    lastClickedMS: 0,
    currentMS: {
        total: 0,
        clicks: 0
    },

    //Tap to change the bpm value
    tap: function () {
        var ms = new Date().getTime() - this.lastClickedMS;
        if(ms <= 3000) {
            //Calculate the rolling average
            this.currentMS.total += ms;
            this.currentMS.clicks++;
            this.setBPM((60 / (this.currentMS.total / this.currentMS.clicks)) * 1000);
            this.beatCallbackFn();
        } else {this.currentMS.total = 0; this.currentMS.clicks = 0;}
        this.lastClickedMS = new Date().getTime();
    },

    //Stop and reset
    reset: function () {
        this.active = false;
        clearInterval(this.intervalFn);
        this.currentBPM = 0;
    },

    //Start the bpm
    start: function () {this.active = true;},

    //Stop the bpm
    stop: function(){this.active = false;},

    //Set the function that is called when the beat is hit
    setBPMCallback(fn){this.beatCallbackFn = fn;},

    //Set a BPM
    setBPM: function (value) {
        var self = this;
        this.currentBPM = value;
        clearInterval(this.intervalFn);
        this.intervalFn = setInterval(function() {
            if(self.active) {
                self.beatCallbackFn();
            }
        }, 60000 / value);
    }
}