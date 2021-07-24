/**
 * LSC CLarity Midi Controller
 * By Hayden Donald 2021
 * 
 * bpm.js - Provides a bpm counter
 */

module.exports = {
    bpms: [],

    //Sync all the metronomes
    sync: function() {
        for(var i in this.bpms){this.bpms[i].resync();}
    },

    //Start all metronomes
    startAll: function() {
        for(var i in this.bpms){this.bpms[i].start();}
    },

    //Stop all metronomes
    stopAll: function() {
        for(var i in this.bpms){this.bpms[i].stop();}
    },

    //Create a metronome
    //BPM is the initial bpm value, if set with start = true the metronome will begin at the set bpm value
    //Offset delay will delay the start of the metronome by x bpm
    create: function(bpm, offsetDelay, start) {
        var temp = {
            currentBPM: 0,
            active: false,
            intervalFn: undefined,
            beatCallbackFn: function(){},
            bpmChangedCallbackFns: [],
            globalMetronome: undefined,
            globalMetronomeBPMScaler: 1,
            globalMetronomeOffsetScaler: 1,
            lastBeatMS: 0,
            offsetBPM: 0,

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
                this.offsetMS = 0;
            },

            //Start the bpm. If resync is set to false it will not resync the metronome
            start: function (resync) {if(resync != false) {this.resync();} this.active = true;},

            //Stop the bpm
            stop: function(){this.active = false;},

            //Resync the metronome, will restart the click. Useful to sync multiple bpms
            resync: function(){this.setBPM(this.currentBPM);},

            //Set the function that is called when the beat is hit
            setBPMCallback(fn){this.beatCallbackFn = fn;},

            //Set the function that is called when the bpm is changed, the parameter will be the bpm
            addBPMChangeCallback(fn){this.bpmChangedCallbackFns.push(fn);},

            //Call the bpm change callback functions
            BPMChangeCallback(bpm){for(var i in this.bpmChangedCallbackFns){this.bpmChangedCallbackFns[i](bpm);}},

            setGlobalMetronome(bpm) {
                var self = this;
                this.globalMetronome = bpm;
                this.globalMetronome.addBPMChangeCallback(function(bpm) {
                    if(self.globalMetronomeBPMScaler != 1 && self.globalMetronomeOffsetScaler != 1) {

                        // console.log("BPM" + bpm * self.globalMetronomeScaler);
                        // console.log("OFFSET: " + self.offsetBPM * self.globalMetronomeScaler);

                        self.setBPM(bpm * self.globalMetronomeBPMScaler, self.offsetBPM * self.globalMetronomeOffsetScaler);
                    }
                });
                this.resync();
            },

            //Set a BPM
            setBPM: function (value, offset) {
                var self = this;
                if(offset){this.offsetBPM = offset;}

                console.log("OFF: " + (this.offsetBPM == 0 ? 0 : (60000 / this.offsetBPM)));

                //If we have a global metronome calculate our scaler to the globals current bpm
                if(this.globalMetronome) {
                    this.globalMetronomeBPMScaler = value / this.globalMetronome.currentBPM;
                    this.globalMetronomeOffsetScaler = offset / this.globalMetronome.currentBPM;
                }

                this.currentBPM = value;
                clearInterval(this.intervalFn);
                this.intervalFn = setInterval(function() {
                    if(self.active) {
                        self.beatCallbackFn();
                    }
                    self.lastBeatMS = new Date().getTime();
                }, (60000 / value) + (this.offsetBPM == 0 ? 0 : (60000 / this.offsetBPM)));
                this.BPMChangeCallback(value);
            }
        };

        if(bpm){
            if(offsetDelay){temp.offsetBPM = offsetDelay;}else{temp.offsetBPM = 0;}
            temp.setBPM(bpm);
            if(start == true) {
                temp.start();
            }
        }

        return this.bpms[this.bpms.push(temp) - 1];
    }
}