# Data Converters for TEKTELIC Network Server
This repository contains the data converters that are to be used on TEKTELIC Network Server for TEKTELIC Sensors. These data converters can be used as a reference for other platforms (such as AWS, TTN, etc).

### Available Sensors 
- AC Switch and Outlet
- Agriculture Sensor
- Enterprise Asset Tracker (BLE Tracker)
- GPS Asset Tracker
- Industrial Transceiver
- Smart Room Sensor Gen3
- Tundra Sensor

### How to add Data Converter to TEKTELIC Network Server
1. Log into Tektelic Network Server ([NA](https://lorawan-ns-na.tektelic.com) or [EU](https://lorawan-ns-eu.tektelic.com))
2. Click on `DATA CONVERTERS` tab on the left
3. Click `+` symbol on top right to add a Data Converter
4. Enter a Name for the Data Converter and Select `Custom` for the Type
5. Copy the code in the data converter file that you wish to use and paste it in Decoder Section
6. Remove the following line from the top of the file:
```javascript
function Decoder(bytes, port) { //bytes - Array of bytes (signed)
```
7. Remove the following line(s) from the bottom of the file:
```javascript
}

module.exports = Decoder;
```
8. Click `Add`

### Notes
- The BLE Tracker is now referred to as the Enterprise Asset Tracker
- Tundra Sensor is also referred to as the Cold Room Sensor