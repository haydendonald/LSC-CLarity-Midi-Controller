# Supported Surfaces
## CMD Touch TC64
### Configuration File (cmdTouchConf.json)
This file defines how the surface will operate.

* ```inputDevice``` The midi input device name
* ```outputDevice``` The midi output device name
* ```gridButton<row>,<col>``` The action that the grid button should take when tapped


### Colours
* off
* dimRed
* brightRed
* dimGreen
* brightGreen
* dimYellow
* brightYellow

### Functions (Separated by a ;)
Example ```flash=brightRed,brightGreen;oscCmd['test']```
* ```setColour=<color>``` Set a button to a colour when clicked
* ```flash=<onColor>,<offColor>``` Sets the button colour to on colour then off colour after sometime