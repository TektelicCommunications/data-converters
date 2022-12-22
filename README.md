# Data Converters for TEKTELIC Devices
This repository contains the data converters that are to be used on TEKTELIC & other Network Server for TEKTELIC Sensors. These data converters can be used as a reference for other platforms.

### Available Sensors 
- AURA
- BREEZE
- CLOVER
- COMFORT
- EDOCTOR
- FLUX
- INDUSTRIAL TRANSCEIVER
- KIWI
- ORCA
- PELICAN
- PELICAN EX
- SEAL
- SPARROW
- TUNDRA
- VIVID

### Available Versions
There are four versions of each data converters available.
- Tektelic v1
- LoRa Alliance® LoRaWAN® Payload Codec API 1.0.0
- TTN v2

### How to add Data Converter to TEKTELIC Network Server
1. Log into TEKTELIC Network Server ([NA](https://lorawan-ns-na.tektelic.com) or [EU](https://lorawan-ns-eu.tektelic.com))
2. Click on `DATA CONVERTERS` tab on the left
3. Click `+` symbol on top right to add a Data Converter
4. Enter a Name for the Data Converter and Select `Custom` if using `Tektelic v1` data converters or `Custom v2` if using `LoRa Alliance Payload Codec 1.0.0` data converters
5. Copy the code in the data converter file that you wish to use and paste it in the available sections
6. Click `Add`

### Data Converter for TTN
- For TTNv2 use the data converters available in `TTNv2` folder
- For TTNv3 use the data converters available in `LoRa Alliance Payload Codec 1.0.0` folder. Uncomment the function header an endings. You can do this by removing the `//` from the top and end of the file.

### Notes
- The files are named [sensor name]-[TRM version]-[data converter type].js
