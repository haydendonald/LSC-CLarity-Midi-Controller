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