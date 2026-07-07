	var decoded_data = {};
	var decoder = [];
	var errors = [];
	var bytes = convertToUint8Array(bytes);
	decoded_data['raw'] = toHexString(bytes).toUpperCase();
	decoded_data['port'] = port;
	var input = {
		"fPort": port,
	}
	if(input.fPort === 101){
		decoder = [
			{
				key: [],
				fn: function(arg) { 
					var size = arg.length;
					var invalid_registers = [];
					var responses = [];
					while(arg.length > 0){
						var downlink_fcnt = arg[0];
						var num_invalid_writes = arg[1];
						arg = arg.slice(2);
						if(num_invalid_writes > 0) {
							for(var i = 0; i < num_invalid_writes; i++){
								invalid_registers.push("0x" + arg[i].toString(16));
							}
							arg = arg.slice(num_invalid_writes);
							responses.push(num_invalid_writes + ' Invalid write command(s) from downlink (' + downlink_fcnt + ') for register(s): ' + invalid_registers);
						}
						else {
							responses.push('All write commands from downlink (' + downlink_fcnt + ') were successful');
						}
						invalid_registers = [];
					}
					decoded_data["response"] = responses;
					return size;
				}
			}
		];
	}
	
if (input.fPort === 10) {
	decoder = [
		{
			key: [0x21, 0x00],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('connector_IO1')) {
					decoded_data['connector_IO1'] = {};
				}
				decoded_data['connector_IO1']['connector_IO1_value'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x22, 0x00],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('connector_IN2')) {
					decoded_data['connector_IN2'] = {};
				}
				decoded_data['connector_IN2']['connector_IN2_value'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x23, 0x6C],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('periodic_uplink')) {
					decoded_data['periodic_uplink'] = {};
				}
				decoded_data['periodic_uplink']['temperature_setpoint'] = decode_field(arg, 1, 7, 0, "unsigned") * 0.5;
				return 1;
			}
		},
		{
			key: [0x24, 0x6A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('thermostat_configuration')) {
					decoded_data['thermostat_configuration'] = {};
				}
				var val = decode_field(arg, 1, 3, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['thermostat_configuration']['thermostat_mode'] = "Auto";
						break;
					case 1:
						decoded_data['thermostat_configuration']['thermostat_mode'] = "Eco";
						break;
					default:
						decoded_data['thermostat_configuration']['thermostat_mode'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['thermostat_configuration']['thermostat_fan_speed'] = "Off";
						break;
					case 1:
						decoded_data['thermostat_configuration']['thermostat_fan_speed'] = "Low";
						break;
					case 2:
						decoded_data['thermostat_configuration']['thermostat_fan_speed'] = "Medium";
						break;
					case 3:
						decoded_data['thermostat_configuration']['thermostat_fan_speed'] = "High";
						break;
					default:
						decoded_data['thermostat_configuration']['thermostat_fan_speed'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x25, 0x01],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('relay_status')) {
					decoded_data['relay_status'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['relay_status']['relay_1_status'] = "Inactive";
						break;
					case 1:
						decoded_data['relay_status']['relay_1_status'] = "Active";
						break;
					default:
						decoded_data['relay_status']['relay_1_status'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['relay_status']['relay_2_status'] = "Inactive";
						break;
					case 1:
						decoded_data['relay_status']['relay_2_status'] = "Active";
						break;
					default:
						decoded_data['relay_status']['relay_2_status'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['relay_status']['relay_3_status'] = "Inactive";
						break;
					case 1:
						decoded_data['relay_status']['relay_3_status'] = "Active";
						break;
					default:
						decoded_data['relay_status']['relay_3_status'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['relay_status']['relay_4_status'] = "Inactive";
						break;
					case 1:
						decoded_data['relay_status']['relay_4_status'] = "Active";
						break;
					default:
						decoded_data['relay_status']['relay_4_status'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['relay_status']['relay_5_status'] = "Inactive";
						break;
					case 1:
						decoded_data['relay_status']['relay_5_status'] = "Active";
						break;
					default:
						decoded_data['relay_status']['relay_5_status'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x03, 0x67],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('periodic_uplink')) {
					decoded_data['periodic_uplink'] = {};
				}
				decoded_data['periodic_uplink']['ambient_temperature'] = (decode_field(arg, 1, 7, 0, "signed") * 0.5).toFixed(1);
				return 1;
			}
		},
		{
			key: [0x04, 0x68],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('periodic_uplink')) {
					decoded_data['periodic_uplink'] = {};
				}
				decoded_data['periodic_uplink']['relative_humidity'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x0B, 0xE4],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('periodic_uplink')) {
					decoded_data['periodic_uplink'] = {};
				}
				decoded_data['periodic_uplink']['CO2_concentration'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x02, 0x00],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ambient_light')) {
					decoded_data['ambient_light'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ambient_light']['ambient_light_state'] = "Dark";
						break;
					case 1:
						decoded_data['ambient_light']['ambient_light_state'] = "Bright";
						break;
					default:
						decoded_data['ambient_light']['ambient_light_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x10, 0x02],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ambient_light')) {
					decoded_data['ambient_light'] = {};
				}
				decoded_data['ambient_light']['ambient_light_intensity'] = decode_field(arg, 1, 6, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x20, 0x93],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('connector_IO1')) {
					decoded_data['connector_IO1'] = {};
				}
				var val = decode_field(arg, 1, 3, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['connector_IO1']['connector_IO1_mode'] = "No Mode Selected";
						break;
					case 1:
						decoded_data['connector_IO1']['connector_IO1_mode'] = "Digital";
						break;
					case 2:
						decoded_data['connector_IO1']['connector_IO1_mode'] = "Analog";
						break;
					case 3:
						decoded_data['connector_IO1']['connector_IO1_mode'] = "Changeover Temperature Sensor";
						break;
					case 4:
						decoded_data['connector_IO1']['connector_IO1_mode'] = "ECM Fan";
						break;
					default:
						decoded_data['connector_IO1']['connector_IO1_mode'] = "Invalid";
				}}
				if(!decoded_data.hasOwnProperty('connector_IN2')) {
					decoded_data['connector_IN2'] = {};
				}
				var val = decode_field(arg, 1, 7, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['connector_IN2']['connector_IN2_mode'] = "No Mode Selected";
						break;
					case 1:
						decoded_data['connector_IN2']['connector_IN2_mode'] = "Digital";
						break;
					case 2:
						decoded_data['connector_IN2']['connector_IN2_mode'] = "Analog";
						break;
					case 3:
						decoded_data['connector_IN2']['connector_IN2_mode'] = "Changeover Temperature Sensor";
						break;
					default:
						decoded_data['connector_IN2']['connector_IN2_mode'] = "Invalid";
				}}
				return 1;
			}
		},
	];
}
if (input.fPort === 20) {
	decoder = [
		{
			key: [0x03, 0x67],
			fn: function(arg) { 
				decoded_data['ambient_temperature'] = (decode_field(arg, 1, 7, 0, "signed") * 0.5).toFixed(1);
				return 1;
			}
		},
		{
			key: [0x04, 0x68],
			fn: function(arg) { 
				decoded_data['relative_humidity'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x0B, 0xE4],
			fn: function(arg) { 
				decoded_data['CO2_concentration'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x02, 0x00],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ambient_light')) {
					decoded_data['ambient_light'] = {};
				}
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ambient_light']['ambient_light_state'] = "Dark";
						break;
					case 255:
						decoded_data['ambient_light']['ambient_light_state'] = "Bright";
						break;
					default:
						decoded_data['ambient_light']['ambient_light_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x10, 0x02],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ambient_light')) {
					decoded_data['ambient_light'] = {};
				}
				decoded_data['ambient_light']['ambient_light_intensity'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x0D, 0x00],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('connector_IO1')) {
					decoded_data['connector_IO1'] = {};
				}
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['connector_IO1']['connector_IO1_state'] = "Low - short-circuited";
						break;
					case 255:
						decoded_data['connector_IO1']['connector_IO1_state'] = "High - open-circuited";
						break;
					default:
						decoded_data['connector_IO1']['connector_IO1_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x1D, 0x00],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('connector_IN2')) {
					decoded_data['connector_IN2'] = {};
				}
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['connector_IN2']['connector_IN2_state'] = "Low - short-circuited";
						break;
					case 255:
						decoded_data['connector_IN2']['connector_IN2_state'] = "High - open-circuited";
						break;
					default:
						decoded_data['connector_IN2']['connector_IN2_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x0E, 0x02],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('connector_IO1')) {
					decoded_data['connector_IO1'] = {};
				}
				decoded_data['connector_IO1']['connector_IO1_analog'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x1E, 0x02],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('connector_IN2')) {
					decoded_data['connector_IN2'] = {};
				}
				decoded_data['connector_IN2']['connector_IN2_analog'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2E, 0x02],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('connector_IO1')) {
					decoded_data['connector_IO1'] = {};
				}
				decoded_data['connector_IO1']['connector_IO1_changeover_temp'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x3E, 0x02],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('connector_IN2')) {
					decoded_data['connector_IN2'] = {};
				}
				decoded_data['connector_IN2']['connector_IN2_changeover_temp'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x0F, 0x03],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('connector_IO1')) {
					decoded_data['connector_IO1'] = {};
				}
				decoded_data['connector_IO1']['connector_IO1_ecm'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
	];
}
if (input.fPort === 5) {
	decoder = [
		{
			key: [0x40, 0x06],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('reset_diagnostics')) {
					decoded_data['reset_diagnostics'] = {};
				}
				var val = decode_field(arg, 5, 39, 32, "unsigned");
				{switch (val){
					case 1:
						decoded_data['reset_diagnostics']['reset_reason'] = "Programmer reset";
						break;
					case 2:
						decoded_data['reset_diagnostics']['reset_reason'] = "SW reset";
						break;
					case 4:
						decoded_data['reset_diagnostics']['reset_reason'] = "Independent watchdog reset";
						break;
					case 16:
						decoded_data['reset_diagnostics']['reset_reason'] = "Power loss reset";
						break;
					case 128:
						decoded_data['reset_diagnostics']['reset_reason'] = "Other resets";
						break;
					default:
						decoded_data['reset_diagnostics']['reset_reason'] = "Invalid";
				}}
				decoded_data['reset_diagnostics']['power_loss_reset_count'] = decode_field(arg, 5, 31, 24, "unsigned");
				decoded_data['reset_diagnostics']['watchdog_reset_count'] = decode_field(arg, 5, 23, 16, "unsigned");
				decoded_data['reset_diagnostics']['sw_reset_count'] = decode_field(arg, 5, 15, 8, "unsigned");
				decoded_data['reset_diagnostics']['programmer_reset_count'] = decode_field(arg, 5, 7, 0, "unsigned");
				return 5;
			}
		},
		{
			key: [0x40, 0x07],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('error_diagnostics')) {
					decoded_data['error_diagnostics'] = {};
				}
				decoded_data['error_diagnostics']['i2c_failure'] = decode_field(arg, 5, 7, 0, "unsigned");
				return 5;
			}
		},
		{
			key: [0x40, 0x08],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('assertion_diagnostics')) {
					decoded_data['assertion_diagnostics'] = {};
				}
				decoded_data['assertion_diagnostics']['lr_failure'] = decode_field(arg, 8, 63, 32, "hexstring");
				decoded_data['assertion_diagnostics']['pc_failure'] = decode_field(arg, 8, 31, 0, "hexstring");
				return 8;
			}
		},
		{
			key: [0x40],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('system_diagnostics_query')) {
					decoded_data['system_diagnostics_query'] = {};
				}
				decoded_data['system_diagnostics_query']['systems_diagnostics_query'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
	];
}
if (input.fPort === 100) {
	decoder = [
		{
			key: [0x11],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('loramac_opts')) {
					decoded_data['loramac_opts'] = {};
				}
				var val = decode_field(arg, 2, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts']['confirm_mode'] = "Unconfirmed";
						break;
					case 1:
						decoded_data['loramac_opts']['confirm_mode'] = "Confirmed";
						break;
					default:
						decoded_data['loramac_opts']['confirm_mode'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts']['sync_word'] = "Private";
						break;
					case 1:
						decoded_data['loramac_opts']['sync_word'] = "Public";
						break;
					default:
						decoded_data['loramac_opts']['sync_word'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts']['duty_cycle'] = "Disable";
						break;
					case 1:
						decoded_data['loramac_opts']['duty_cycle'] = "Enable";
						break;
					default:
						decoded_data['loramac_opts']['duty_cycle'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts']['adr'] = "Disable";
						break;
					case 1:
						decoded_data['loramac_opts']['adr'] = "Enable";
						break;
					default:
						decoded_data['loramac_opts']['adr'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 15, 14, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts']['device_class'] = "Class A";
						break;
					case 1:
						decoded_data['loramac_opts']['device_class'] = "RFU";
						break;
					case 2:
						decoded_data['loramac_opts']['device_class'] = "Class C";
						break;
					case 3:
						decoded_data['loramac_opts']['device_class'] = "RFU";
						break;
					default:
						decoded_data['loramac_opts']['device_class'] = "Invalid";
				}}
				return 2;
			}
		},
		{
			key: [0x12],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('loramac_dr_tx')) {
					decoded_data['loramac_dr_tx'] = {};
				}
				decoded_data['loramac_dr_tx']['dr_number'] = decode_field(arg, 2, 11, 8, "unsigned");
				decoded_data['loramac_dr_tx']['tx_power_number'] = decode_field(arg, 2, 3, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x20],
			fn: function(arg) { 
				decoded_data['minutes_per_core_tick'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x50],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['display_temperature_unit'] = "Degrees Celsius";
						break;
					case 1:
						decoded_data['display_temperature_unit'] = "Fahrenheit";
						break;
					default:
						decoded_data['display_temperature_unit'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x51],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['display_date_format'] = "ISO YYYY-MM-DD";
						break;
					case 1:
						decoded_data['display_date_format'] = "US MM/DD/YYYY";
						break;
					default:
						decoded_data['display_date_format'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x52],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['display_time_format'] = "24-hour clock";
						break;
					case 1:
						decoded_data['display_time_format'] = "12-hour clock";
						break;
					default:
						decoded_data['display_time_format'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x53],
			fn: function(arg) { 
				decoded_data['display_backlight_brightness'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x54],
			fn: function(arg) { 
				decoded_data['button_backlight_brightness'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x5A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('time_correction_event')) {
					decoded_data['time_correction_event'] = {};
				}
				decoded_data['time_correction_event']['applied_offset'] = decode_field(arg, 6, 47, 32, "signed");
				decoded_data['time_correction_event']['GPS_offset_time'] = decode_field(arg, 6, 31, 0, "unsigned");
				return 6;
			}
		},
		{
			key: [0x5B],
			fn: function(arg) { 
				decoded_data['time_zone_offset'] = decode_field(arg, 1, 7, 0, "signed");
				return 1;
			}
		},
		{
			key: [0x60],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['wiring_mode_setup'] = "No Mode Selected";
						break;
					case 1:
						decoded_data['wiring_mode_setup'] = "2-Pipe HEATING, 2-Wire Valve";
						break;
					case 2:
						decoded_data['wiring_mode_setup'] = "2-Pipe COOLING, 2-Wire Valve";
						break;
					case 3:
						decoded_data['wiring_mode_setup'] = "2-Pipe HEATING, 3-Wire Valve";
						break;
					case 4:
						decoded_data['wiring_mode_setup'] = "2-Pipe COOLING, 3-Wire Valve";
						break;
					case 5:
						decoded_data['wiring_mode_setup'] = "4-Pipe HEATING and COOLING, 2-Wire Valve";
						break;
					case 6:
						decoded_data['wiring_mode_setup'] = "4-Pipe HEATING ONLY, 2-Wire Valve";
						break;
					case 7:
						decoded_data['wiring_mode_setup'] = "4-Pipe COOLING ONLY, 2-Wire Valve";
						break;
					case 9:
						decoded_data['wiring_mode_setup'] = "2-Pipe COOLING, Electric Heater";
						break;
					case 10:
						decoded_data['wiring_mode_setup'] = "2-Pipe Changeover Temperature Sensor, 2-Wire Valve";
						break;
					case 11:
						decoded_data['wiring_mode_setup'] = "2-Pipe Changeover Temperature Sensor, 3-Wire Valve";
						break;
					default:
						decoded_data['wiring_mode_setup'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x62],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('allowable_temperature_setpoint_range')) {
					decoded_data['allowable_temperature_setpoint_range'] = {};
				}
				decoded_data['allowable_temperature_setpoint_range']['max_temperature_setpoint'] = decode_field(arg, 2, 15, 8, "unsigned");
				decoded_data['allowable_temperature_setpoint_range']['min_temperature_setpoint'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x63],
			fn: function(arg) { 
				decoded_data['comfort_temperature_setpoint'] = (decode_field(arg, 1, 7, 0, "unsigned") * 0.5).toFixed(1);
				return 1;
			}
		},
		{
			key: [0x64],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['display_operational_mode'] = "Auto";
						break;
					case 1:
						decoded_data['display_operational_mode'] = "Eco";
						break;
					default:
						decoded_data['display_operational_mode'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x65],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 1, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['display_fan_speed'] = "Off";
						break;
					case 1:
						decoded_data['display_fan_speed'] = "Low";
						break;
					case 2:
						decoded_data['display_fan_speed'] = "Medium";
						break;
					case 3:
						decoded_data['display_fan_speed'] = "High";
						break;
					default:
						decoded_data['display_fan_speed'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x6A],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['scheduling_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['scheduling_enabled'] = "Enabled";
						break;
					default:
						decoded_data['scheduling_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x6B],
			fn: function(arg) { 
				decoded_data['economy_temperature_setpoint'] = (decode_field(arg, 1, 7, 0, "unsigned") * 0.5).toFixed(1);
				return 1;
			}
		},
		{
			key: [0x6C],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('scheduling_mode_options')) {
					decoded_data['scheduling_mode_options'] = {};
				}
				decoded_data['scheduling_mode_options']['economy_start_hr'] = decode_field(arg, 3, 23, 16, "unsigned");
				decoded_data['scheduling_mode_options']['economy_end_hr'] = decode_field(arg, 3, 15, 8, "unsigned");
				var val = decode_field(arg, 3, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['scheduling_mode_options']['economy_on_sunday'] = "Disabled";
						break;
					case 1:
						decoded_data['scheduling_mode_options']['economy_on_sunday'] = "Enabled";
						break;
					default:
						decoded_data['scheduling_mode_options']['economy_on_sunday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['scheduling_mode_options']['economy_on_monday'] = "Disabled";
						break;
					case 1:
						decoded_data['scheduling_mode_options']['economy_on_monday'] = "Enabled";
						break;
					default:
						decoded_data['scheduling_mode_options']['economy_on_monday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['scheduling_mode_options']['economy_on_tuesday'] = "Disabled";
						break;
					case 1:
						decoded_data['scheduling_mode_options']['economy_on_tuesday'] = "Enabled";
						break;
					default:
						decoded_data['scheduling_mode_options']['economy_on_tuesday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['scheduling_mode_options']['economy_on_wednesday'] = "Disabled";
						break;
					case 1:
						decoded_data['scheduling_mode_options']['economy_on_wednesday'] = "Enabled";
						break;
					default:
						decoded_data['scheduling_mode_options']['economy_on_wednesday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['scheduling_mode_options']['economy_on_thursday'] = "Disabled";
						break;
					case 1:
						decoded_data['scheduling_mode_options']['economy_on_thursday'] = "Enabled";
						break;
					default:
						decoded_data['scheduling_mode_options']['economy_on_thursday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['scheduling_mode_options']['economy_on_friday'] = "Disabled";
						break;
					case 1:
						decoded_data['scheduling_mode_options']['economy_on_friday'] = "Enabled";
						break;
					default:
						decoded_data['scheduling_mode_options']['economy_on_friday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 6, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['scheduling_mode_options']['economy_on_saturday'] = "Disabled";
						break;
					case 1:
						decoded_data['scheduling_mode_options']['economy_on_saturday'] = "Enabled";
						break;
					default:
						decoded_data['scheduling_mode_options']['economy_on_saturday'] = "Invalid";
				}}
				return 3;
			}
		},
		{
			key: [0x30],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ambient_temperature_threshold')) {
					decoded_data['ambient_temperature_threshold'] = {};
				}
				decoded_data['ambient_temperature_threshold']['temp_threshold_high'] = decode_field(arg, 2, 15, 8, "unsigned");
				decoded_data['ambient_temperature_threshold']['temp_threshold_low'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x31],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['temp_thresholds_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['temp_thresholds_enabled'] = "Enabled";
						break;
					default:
						decoded_data['temp_thresholds_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x32],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('relative_humidity_threshold')) {
					decoded_data['relative_humidity_threshold'] = {};
				}
				decoded_data['relative_humidity_threshold']['rh_threshold_high'] = decode_field(arg, 2, 15, 8, "unsigned");
				decoded_data['relative_humidity_threshold']['rh_threshold_low'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x33],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['rh_thresholds_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['rh_thresholds_enabled'] = "Enabled";
						break;
					default:
						decoded_data['rh_thresholds_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x34],
			fn: function(arg) { 
				decoded_data['co2_threshold_high'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x35],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['co2_thresholds_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['co2_thresholds_enabled'] = "Enabled";
						break;
					default:
						decoded_data['co2_thresholds_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x36],
			fn: function(arg) { 
				decoded_data['light_threshold_level'] = decode_field(arg, 1, 5, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x37],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['light_threshold_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['light_threshold_enabled'] = "Enabled";
						break;
					default:
						decoded_data['light_threshold_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x3E],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 2, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['connector_IO1_mode'] = "No mode selected";
						break;
					case 1:
						decoded_data['connector_IO1_mode'] = "Digital Input";
						break;
					case 2:
						decoded_data['connector_IO1_mode'] = "Analog Input";
						break;
					case 3:
						decoded_data['connector_IO1_mode'] = "Changeover Temperature Sensor";
						break;
					case 4:
						decoded_data['connector_IO1_mode'] = "ECM Fan Control";
						break;
					default:
						decoded_data['connector_IO1_mode'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x3F],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 1, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['connector_IN2_mode'] = "No mode selected";
						break;
					case 1:
						decoded_data['connector_IN2_mode'] = "Digital Input";
						break;
					case 2:
						decoded_data['connector_IN2_mode'] = "Analog Input";
						break;
					case 3:
						decoded_data['connector_IN2_mode'] = "Changeover Temperature Sensor";
						break;
					default:
						decoded_data['connector_IN2_mode'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x38],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('IO1_digital_input_control')) {
					decoded_data['IO1_digital_input_control'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['IO1_digital_input_control']['IO1_rising_edge_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['IO1_digital_input_control']['IO1_rising_edge_enabled'] = "Enabled";
						break;
					default:
						decoded_data['IO1_digital_input_control']['IO1_rising_edge_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['IO1_digital_input_control']['IO1_falling_edge_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['IO1_digital_input_control']['IO1_falling_edge_enabled'] = "Enabled";
						break;
					default:
						decoded_data['IO1_digital_input_control']['IO1_falling_edge_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x39],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('IN2_digital_input_control')) {
					decoded_data['IN2_digital_input_control'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['IN2_digital_input_control']['IN2_rising_edge_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['IN2_digital_input_control']['IN2_rising_edge_enabled'] = "Enabled";
						break;
					default:
						decoded_data['IN2_digital_input_control']['IN2_rising_edge_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['IN2_digital_input_control']['IN2_falling_edge_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['IN2_digital_input_control']['IN2_falling_edge_enabled'] = "Enabled";
						break;
					default:
						decoded_data['IN2_digital_input_control']['IN2_falling_edge_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x3A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('IO1_analog_input_thresholds')) {
					decoded_data['IO1_analog_input_thresholds'] = {};
				}
				decoded_data['IO1_analog_input_thresholds']['IO1_analog_input_high_threshold'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['IO1_analog_input_thresholds']['IO1_analog_input_low_threshold'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3B],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('IN2_analog_input_thresholds')) {
					decoded_data['IN2_analog_input_thresholds'] = {};
				}
				decoded_data['IN2_analog_input_thresholds']['IN2_analog_input_high_threshold'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['IN2_analog_input_thresholds']['IN2_analog_input_low_threshold'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3C],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['analog_input_thresholds_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['analog_input_thresholds_enabled'] = "Enabled";
						break;
					default:
						decoded_data['analog_input_thresholds_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x41],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('IO1_changeover_temp_thresholds')) {
					decoded_data['IO1_changeover_temp_thresholds'] = {};
				}
				decoded_data['IO1_changeover_temp_thresholds']['IO1_changeover_temp_cooling_threshold'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['IO1_changeover_temp_thresholds']['IO1_changeover_temp_heating_threshold'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x42],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('IN2_changeover_temp_thresholds')) {
					decoded_data['IN2_changeover_temp_thresholds'] = {};
				}
				decoded_data['IN2_changeover_temp_thresholds']['IN2_changeover_temp_cooling_threshold'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['IN2_changeover_temp_thresholds']['IN2_changeover_temp_heating_threshold'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x43],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['changeover_temp_thresholds_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['changeover_temp_thresholds_enabled'] = "Enabled";
						break;
					default:
						decoded_data['changeover_temp_thresholds_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x3D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ecm_fan_output')) {
					decoded_data['ecm_fan_output'] = {};
				}
				decoded_data['ecm_fan_output']['high_ecm_input'] = decode_field(arg, 6, 47, 32, "unsigned");
				decoded_data['ecm_fan_output']['medium_ecm_input'] = decode_field(arg, 6, 31, 16, "unsigned");
				decoded_data['ecm_fan_output']['low_ecm_input'] = decode_field(arg, 6, 15, 0, "unsigned");
				return 6;
			}
		},
		{
			key: [0x71],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('metadata')) {
					decoded_data['metadata'] = {};
				}
				decoded_data['metadata']['app_ver_major'] = decode_field(arg, 7, 55, 48, "unsigned");
				decoded_data['metadata']['app_ver_minor'] = decode_field(arg, 7, 47, 40, "unsigned");
				decoded_data['metadata']['app_ver_revision'] = decode_field(arg, 7, 39, 32, "unsigned");
				decoded_data['metadata']['modem_ver_major'] = decode_field(arg, 7, 31, 24, "unsigned");
				decoded_data['metadata']['modem_ver_minor'] = decode_field(arg, 7, 23, 16, "unsigned");
				decoded_data['metadata']['modem_ver_revision'] = decode_field(arg, 7, 15, 8, "unsigned");
				var val = decode_field(arg, 7, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['metadata']['loramac_region'] = "EU868";
						break;
					case 1:
						decoded_data['metadata']['loramac_region'] = "US915";
						break;
					case 2:
						decoded_data['metadata']['loramac_region'] = "AS923";
						break;
					case 3:
						decoded_data['metadata']['loramac_region'] = "AU915";
						break;
					case 4:
						decoded_data['metadata']['loramac_region'] = "IN865";
						break;
					case 6:
						decoded_data['metadata']['loramac_region'] = "KR920";
						break;
					case 7:
						decoded_data['metadata']['loramac_region'] = "RU864";
						break;
					default:
						decoded_data['metadata']['loramac_region'] = "Invalid";
				}}
				return 7;
			}
		},
	];
}

	try {
		for (var bytes_left = bytes.length; bytes_left > 0;) {
			var found = false;
			for (var i = 0; i < decoder.length; i++) {
				var item = decoder[i];
				var key = item.key;
				var keylen = key.length;
				var header = slice(bytes, 0, keylen);
				if (is_equal(header, key)) { // Header in the data matches to what we expect
					var f = item.fn;
					var consumed = f(slice(bytes, keylen, bytes.length)) + keylen;
					bytes_left -= consumed;
					bytes = slice(bytes, consumed, bytes.length);
					found = true;
					break;
				}
			}
			if (!found) {
				errors.push("Unable to decode header " + toHexString(header).toUpperCase());
				break;
			}
		}
	} catch (error) {
		errors = "Fatal decoder error";
	}

	function slice(a, f, t) {
		var res = [];
		for (var i = 0; i < t - f; i++) {
			res[i] = a[f + i];
		}
		return res;
	}

	// Extracts bits from a byte array
	function extract_bytes(chunk, startBit, endBit) {
		var array = new Array(0);
		var totalBits = startBit - endBit + 1;
		var totalBytes = Math.ceil(totalBits / 8);
		var endBits = 0;
		var startBits = 0;
		for (var i = 0; i < totalBytes; i++) {
			if(totalBits > 8) {
				endBits = endBit;
				startBits = endBits + 7;
				endBit = endBit + 8;
				totalBits -= 8;
			} else {
				endBits = endBit;
				startBits = endBits + totalBits - 1;
				totalBits = 0;
			}
			var endChunk = chunk.length - Math.ceil((endBits + 1) / 8);
			var startChunk = chunk.length - Math.ceil((startBits + 1) / 8);
			var word = 0x0;
			if (startChunk == endChunk){
				var endOffset = endBits % 8;
				var startOffset = startBits % 8;
				var mask = 0xFF >> (8 - (startOffset - endOffset + 1));
				word = (chunk[startChunk] >> endOffset) & mask;
				array.unshift(word);
			} else {
				var endChunkEndOffset = endBits % 8;
				var endChunkStartOffset = 7;
				var endChunkMask = 0xFF >> (8 - (endChunkStartOffset - endChunkEndOffset + 1));
				var endChunkWord = (chunk[endChunk] >> endChunkEndOffset) & endChunkMask;
				var startChunkEndOffset = 0;
				var startChunkStartOffset = startBits % 8;
				var startChunkMask = 0xFF >> (8 - (startChunkStartOffset - startChunkEndOffset + 1));
				var startChunkWord = (chunk[startChunk] >> startChunkEndOffset) & startChunkMask;
				var startChunkWordShifted = startChunkWord << (endChunkStartOffset - endChunkEndOffset + 1);
				word = endChunkWord | startChunkWordShifted;
				array.unshift(word);
			}
		}
		return array;
	}

	// Applies data type to a byte array
	function apply_data_type(bytes, data_type) {
		var output = 0;
		if (data_type === "unsigned") {
			for (var i = 0; i < bytes.length; ++i) {
				output = (to_uint(output << 8)) | bytes[i];
			}
			return output;
		}
		if (data_type === "signed") {
			for (var i = 0; i < bytes.length; ++i) {
				output = (output << 8) | bytes[i];
			}
			// Convert to signed, based on value size
			if (output > Math.pow(2, 8 * bytes.length - 1)) {
				output -= Math.pow(2, 8 * bytes.length);
			}
			return output;
		}
		if (data_type === "bool") {
			return !(bytes[0] === 0);
		}
		if (data_type === "hexstring") {
			return toHexString(bytes);
		}
		return null; // Incorrect data type
	}

	// Decodes bitfield from the given chunk of bytes
	function decode_field(chunk, size, start_bit, end_bit, data_type) {
		var new_chunk = chunk.slice(0, size);
		var chunk_size = new_chunk.length;
		if (start_bit >= chunk_size * 8) {
			return null; // Error: exceeding boundaries of the chunk
		}
		if (start_bit < end_bit) {
			return null; // Error: invalid input
		}
		var array = extract_bytes(new_chunk, start_bit, end_bit);
		return apply_data_type(array, data_type);
	}

	// Converts value to unsigned
	function to_uint(x) {
		return x >>> 0;
	}

	// Checks if two arrays are equal
	function is_equal(arr1, arr2) {
		if (arr1.length != arr2.length) {
			return false;
		}
		for (var i = 0; i != arr1.length; i++) {
			if (arr1[i] != arr2[i]) {
				return false;
			}
		}
		return true;
	}

	// Converts array of bytes to hex string
	function toHexString(byteArray) {
		var arr = [];
		for (var i = 0; i < byteArray.length; ++i) {
			arr.push(('0' + (byteArray[i] & 0xFF).toString(16)).slice(-2));
		}
		return arr.join(' ');
	}

    // Converts array of bytes to 8 bit array
    function convertToUint8Array(byteArray) {
		var arr = [];
		for (var i = 0; i < byteArray.length; i++) {
			arr.push(to_uint(byteArray[i]) & 0xff);
		}
		return arr;
	}
    decoded_data["errors"] = errors;
    return decoded_data;
