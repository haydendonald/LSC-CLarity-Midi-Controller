# LSC CLarity Midi Controller
This project aims to provide control of LSC CLarity over OSC using a [CMD Touch TC64](https://www.behringer.com/product.html?modelCode=P0B3N) and [Behringer BCF2000](https://www.behringer.com/behringer/product?modelCode=P0246).

## Project in development
This project is currently in development so there will be bugs and missing features.

## Features
### CMD Touch TC64
* Basic midi behavior that is included in the software ```[Not implemented]```
* Calling of cue lists to a global BPM ```[Not implemented]```
* Toggle cue lists ```[Not implemented]```
* Tap (Tap to set bpm then hold to activate / deactivate) ```[Not implemented]```
* Selection of groups in the programmer ```[Not implemented]```

## Project Dependencies
Thank you to the following which make this possible!
* OSC by colindbclark [project](https://www.npmjs.com/package/osc) provides the OSC protocol.
* MIDI by justinlatimer [project](https://www.npmjs.com/package/midi) provides the MIDI connection.
* NConf by flatiron [project](https://www.npmjs.com/package/nconf) provides the configuration file handling.

# Basic Actions
Below are the actions supported by all surfaces

* Debug
```
Print a message to the console
command = debug
parameters = <message>
```

# Supported Surfaces
## CMD Touch TC64
### Configuration File (cmdTouchConf.json)
This file defines how the surface will operate.

* ```inputDevice``` The midi input device name
* ```outputDevice``` The midi output device name
* ```gridButton<row>,<col>``` The settings for each grid button

### Colours
* off
* dimRed
* brightRed
* dimGreen
* brightGreen
* dimYellow
* brightYellow

### Actions
Below are the actions supported by the surface, this includes the extra actions below as well as the general actions

Example
```
{
    "gridButton7,7": { // The button
    "actions": [
      {
        "command": "flash", // The command to operate
        "parameter": "brightGreen,brightRed", //The parameters for the command
        "trigger": "pressed" //The trigger pressed/released/both
      }
    ],
    "defaultColour": "brightYellow" //The colour to set the button to on startup
  }
}
```

* Set Colour
```
Set a button to a colour when clicked
command = setColour
parameters = <color>
```

* Flash
```
Sets the button colour to on colour then off colour after sometime
command = flash
parameters = <onColor>,<offColor>
```