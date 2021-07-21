/**
 * LSC CLarity Midi Controller
 * By Hayden Donald 2021
 * 
 * bpm.js - Provides a bpm counter
 */

module.exports = {
    currentBPM: 0,
    active: false,
    timeoutPeriodMS: 0,
    intervalFn: undefined,
    tapCalc: {
        calculatingTap: false,
        lastMS: 0,
        ms: 0,
        times: 1,
        timeout: undefined,






        
        timeSince: 0,
        tapCalculationInterval: undefined,
    },
    beatCallbackFn: function(){},

    //Tap to change the bpm value
    tap: function () {
        var self = this;

        //Set a timeout to clear the calculation
        clearTimeout(this.tapCalc.timeout);
        this.tapCalc.timeout = setTimeout(function() {
            self.tapCalc.calculatingTap = false;
            self.tapCalc.ms = 0;
        }, 3000);

        //If this is the first tap set our start ms
        if(!this.tapCalc.calculatingTap) {
            this.tapCalc.lastMS = new Date().getTime();
            this.tapCalc.calculatingTap = true;
        }

        this.tapCalc.ms += (new Date().getTime() - this.tapCalc.lastMS);
        this.setBPM((60 / (this.tapCalc.ms / this.tapCalc.times)) * 1000);
        this.tapCalc.times++;
        this.tapCalc.lastMS = new Date().getTime();




        // if(!this.tapCalc.calculatingTap) {
        //     this.tapCalc.ms = 0;
        //     this.tapCalc.timeSince = 0;
        //     this.tapCalc.times = 0;

        //     this.tapCalc.calculatingTap = true;
        //     clearInterval(this.tapCalc.tapCalculationInterval);
        //     this.tapCalc.tapCalculationInterval = setInterval(function() {
        //         //After 3 seconds give up
        //         if(self.tapCalc.timeSince >= 3000) {
        //             self.tapCalc.calculatingTap = false;
        //             clearInterval(self.tapCalc.tapCalculationInterval);
        //         }
        //         //Count
        //         else {
        //             self.tapCalc.timeSince += 10;
        //         }
        //     }, 10);
        //     return;
        // }

        // this.tapCalc.ms = this.tapCalc.ms + this.tapCalc.timeSince;
        // this.tapCalc.timeSince = 0;
        // this.tapCalc.times++;
        //this.setBPM((60 / (this.tapCalc.ms / this.tapCalc.times)) * 1000);
    },

    //Stop and reset
    reset: function () {
        clearInterval(this.intervalFn);
        this.active = false;
        this.timeoutPeriodMS = 0;
        this.currentBPM = 0;
    },

    //Start the bpm
    start: function () {
        this.active = true;
    },

    //Set the function that is called when the beat is hit
    setBPMCallback(fn){this.beatCallbackFn = fn;},

    //Set a BPM
    setBPM: function (value) {
        var self = this;
        this.currentBPM = value;
        this.timeoutPeriodMS = 60000 / value;
        clearInterval(this.intervalFn);
        this.intervalFn = setInterval(function() {
            if(self.active) {
                self.beatCallbackFn();
            }
        }, this.timeoutPeriodMS);
    }
}