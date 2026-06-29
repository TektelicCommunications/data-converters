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
							responses.push(num_invalid_writes + ' Invalid write command(s) from DL:' + downlink_fcnt + ' for register(s): ' + invalid_registers);
						}
						else {
							responses.push('All write commands from DL:' + downlink_fcnt + 'were successfull');
						}
						invalid_registers = [];
					}
					decoded_data["response"] = responses;
					return size;
				}
			}
		];
	}
	
if (input.fPort === 0) {
	decoder = [
		{
			key: [],
			fn: function(arg) { 
				decoded_data['forced_magnetic'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
	];
}
if (input.fPort === 10) {
	decoder = [
		{
			key: [0x00, 0xFF],
			fn: function(arg) { 
				decoded_data['battery_voltage'] = (decode_field(arg, 2, 15, 0, "signed") * 0.01).toFixed(2);
				return 2;
			}
		},
		{
			key: [0x00, 0xD3],
			fn: function(arg) { 
				decoded_data['rem_batt_capacity'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x00, 0xBD],
			fn: function(arg) { 
				decoded_data['rem_batt_days'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x0B, 0x67],
			fn: function(arg) { 
				decoded_data['mcu_temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x03, 0x67],
			fn: function(arg) { 
				decoded_data['ambient_temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x04, 0x68],
			fn: function(arg) { 
				decoded_data['relative_humidity'] = (decode_field(arg, 1, 7, 0, "unsigned") * 0.5).toFixed(1);
				return 1;
			}
		},
		{
			key: [0x0E, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ext_reed_switch_state'] = "Magnet Present";
						break;
					case 1:
						decoded_data['ext_reed_switch_state'] = "Magnet Absent";
						break;
					default:
						decoded_data['ext_reed_switch_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x0F, 0x04],
			fn: function(arg) { 
				decoded_data['ext_reed_switch_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x02, 0x02],
			fn: function(arg) { 
				decoded_data['ext_probe_voltage'] = (decode_field(arg, 2, 15, 0, "signed") * 0.001).toFixed(3);
				return 2;
			}
		},
		{
			key: [0x02, 0x67],
			fn: function(arg) { 
				decoded_data['ext_probe_temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x00, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accel_alarm'] = "Alarm inactive";
						break;
					case 255:
						decoded_data['accel_alarm'] = "Alarm active";
						break;
					default:
						decoded_data['accel_alarm'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x07, 0x71],
			fn: function(arg) { 
				decoded_data['xaxis'] = (decode_field(arg, 6, 47, 32, "signed") * 0.001).toFixed(3);
				decoded_data['yaxis'] = (decode_field(arg, 6, 31, 16, "signed") * 0.001).toFixed(3);
				decoded_data['zaxis'] = (decode_field(arg, 6, 15, 0, "signed") * 0.001).toFixed(3);
				return 6;
			}
		},
		{
			key: [0x09, 0x02],
			fn: function(arg) { 
				decoded_data['ext_probe_voltage_2'] = (decode_field(arg, 2, 15, 0, "signed") * 0.001).toFixed(3);
				return 2;
			}
		},
		{
			key: [0x09, 0x67],
			fn: function(arg) { 
				decoded_data['ext_probe_temperature_2'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
	];
}
if (input.fPort === 32) {
	if (bytes.length >= 2) {
		decoded_data['tag_entry'] = decode_field(bytes, 2, 15, 0, "unsigned");
		bytes = slice(bytes, 2, bytes.length);
	} else {
		decoded_data['tag_entry'] = null;
		bytes = [];
	}
	decoder = [
		{
			key: [0x03, 0x67],
			fn: function(arg) { 
				decoded_data['tagged_ambient_temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x04, 0x68],
			fn: function(arg) { 
				decoded_data['tagged_relative_humidity'] = (decode_field(arg, 1, 7, 0, "unsigned") * 0.5).toFixed(1);
				return 1;
			}
		},
		{
			key: [0x02, 0x02],
			fn: function(arg) { 
				decoded_data['tagged_ext_probe_voltage'] = (decode_field(arg, 2, 15, 0, "signed") * 0.001).toFixed(3);
				return 2;
			}
		},
		{
			key: [0x02, 0x67],
			fn: function(arg) { 
				decoded_data['tagged_ext_probe_temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
	];
}
if (input.fPort === 100) {
	decoder = [
		{
			key: [0x0F],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('tagged_telemetry')) {
					decoded_data['tagged_telemetry'] = {};
				}
				var val = decode_field(arg, 2, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['tagged_telemetry']['rh_tag_status'] = "Not Tagged";
						break;
					case 1:
						decoded_data['tagged_telemetry']['rh_tag_status'] = "Tagged";
						break;
					default:
						decoded_data['tagged_telemetry']['rh_tag_status'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['tagged_telemetry']['temp_tag_status'] = "Not Tagged";
						break;
					case 1:
						decoded_data['tagged_telemetry']['temp_tag_status'] = "Tagged";
						break;
					default:
						decoded_data['tagged_telemetry']['temp_tag_status'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['tagged_telemetry']['ext_probe_tag_status'] = "Not Tagged";
						break;
					case 1:
						decoded_data['tagged_telemetry']['ext_probe_tag_status'] = "Tagged";
						break;
					default:
						decoded_data['tagged_telemetry']['ext_probe_tag_status'] = "Invalid";
				}}
				return 2;
			}
		},
		{
			key: [0x10],
			fn: function(arg) { 
				var val = decode_field(arg, 2, 15, 15, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_join_mode'] = "ABP";
						break;
					case 1:
						decoded_data['loramac_join_mode'] = "OTAA";
						break;
					default:
						decoded_data['loramac_join_mode'] = "Invalid";
				}}
				return 2;
			}
		},
		{
			key: [0x11],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('loramac_opts')) {
					decoded_data['loramac_opts'] = {};
				}
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
				decoded_data['loramac_dr_tx']['tx_power'] = decode_field(arg, 2, 3, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x13],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('loramac_rx2')) {
					decoded_data['loramac_rx2'] = {};
				}
				decoded_data['loramac_rx2']['frequency'] = decode_field(arg, 5, 39, 8, "unsigned");
				decoded_data['loramac_rx2']['dr_number_rx2'] = decode_field(arg, 5, 7, 0, "unsigned");
				return 5;
			}
		},
		{
			key: [0x20],
			fn: function(arg) { 
				decoded_data['seconds_per_core_tick'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x21],
			fn: function(arg) { 
				decoded_data['tick_per_battery'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x22],
			fn: function(arg) { 
				decoded_data['tick_per_ambient_temperature'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x23],
			fn: function(arg) { 
				decoded_data['tick_per_relative_humidity'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x24],
			fn: function(arg) { 
				decoded_data['ticks_per_accelerometer'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x27],
			fn: function(arg) { 
				decoded_data['tick_per_mcu_temperature'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x28],
			fn: function(arg) { 
				decoded_data['tick_per_external_probe'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ext_probe')) {
					decoded_data['ext_probe'] = {};
				}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ext_probe']['probe_mode'] = "Digital";
						break;
					case 1:
						decoded_data['ext_probe']['probe_mode'] = "Analog";
						break;
					default:
						decoded_data['ext_probe']['probe_mode'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ext_probe']['probe_falling_edge_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['ext_probe']['probe_falling_edge_enabled'] = "Enable";
						break;
					default:
						decoded_data['ext_probe']['probe_falling_edge_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ext_probe']['probe_rising_edge_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['ext_probe']['probe_rising_edge_enabled'] = "Enable";
						break;
					default:
						decoded_data['ext_probe']['probe_rising_edge_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x2E],
			fn: function(arg) { 
				decoded_data['ext_reed_switch_count_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2F],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ext_reed_switch_tx')) {
					decoded_data['ext_reed_switch_tx'] = {};
				}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ext_reed_switch_tx']['report_voltage_temperature_enabled'] = "Analog Voltage Reported";
						break;
					case 1:
						decoded_data['ext_reed_switch_tx']['report_voltage_temperature_enabled'] = "Temperature Reported";
						break;
					default:
						decoded_data['ext_reed_switch_tx']['report_voltage_temperature_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ext_reed_switch_tx']['report_count_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['ext_reed_switch_tx']['report_count_enabled'] = "Enable";
						break;
					default:
						decoded_data['ext_reed_switch_tx']['report_count_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ext_reed_switch_tx']['report_state_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['ext_reed_switch_tx']['report_state_enabled'] = "Enable";
						break;
					default:
						decoded_data['ext_reed_switch_tx']['report_state_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x39],
			fn: function(arg) { 
				decoded_data['temperature_relative_humidity_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3A],
			fn: function(arg) { 
				decoded_data['temperature_relative_humidity_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3B],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ambient_temperature_threshold')) {
					decoded_data['ambient_temperature_threshold'] = {};
				}
				decoded_data['ambient_temperature_threshold']['low_temp'] = (decode_field(arg, 2, 7, 0, "signed")).toFixed(1);
				decoded_data['ambient_temperature_threshold']['high_temp'] = (decode_field(arg, 2, 15, 8, "signed")).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x3C],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ambient_temperature_threshold_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['ambient_temperature_threshold_enabled'] = "Enable";
						break;
					default:
						decoded_data['ambient_temperature_threshold_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x3D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('relative_humidity_threshold')) {
					decoded_data['relative_humidity_threshold'] = {};
				}
				decoded_data['relative_humidity_threshold']['low_humidity'] = (decode_field(arg, 2, 7, 0, "unsigned")).toFixed(1);
				decoded_data['relative_humidity_threshold']['high_humidity'] = (decode_field(arg, 2, 15, 8, "unsigned")).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x3E],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['rh_threshold_enable'] = "Disable";
						break;
					case 1:
						decoded_data['rh_threshold_enable'] = "Enable";
						break;
					default:
						decoded_data['rh_threshold_enable'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x40],
			fn: function(arg) { 
				decoded_data['mcu_temperature_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x41],
			fn: function(arg) { 
				decoded_data['mcu_temperature_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x42],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('mcu_temperature_threshold')) {
					decoded_data['mcu_temperature_threshold'] = {};
				}
				decoded_data['mcu_temperature_threshold']['high_mcu'] = (decode_field(arg, 2, 15, 8, "signed")).toFixed(1);
				decoded_data['mcu_temperature_threshold']['low_mcu'] = (decode_field(arg, 2, 7, 0, "signed")).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x43],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mcu_temperature_threshold_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['mcu_temperature_threshold_enabled'] = "Enable";
						break;
					default:
						decoded_data['mcu_temperature_threshold_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x44],
			fn: function(arg) { 
				decoded_data['probe_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x45],
			fn: function(arg) { 
				decoded_data['probe_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x46],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('probe_voltage_threshold')) {
					decoded_data['probe_voltage_threshold'] = {};
				}
				decoded_data['probe_voltage_threshold']['probe_voltage_high (V)'] = (decode_field(arg, 4, 31, 16, "unsigned") * 0.001).toFixed(3);
				decoded_data['probe_voltage_threshold']['probe_voltage_low (V)'] = (decode_field(arg, 4, 15, 0, "unsigned") * 0.001).toFixed(3);
				return 4;
			}
		},
		{
			key: [0x47],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('probe_temp_threshold')) {
					decoded_data['probe_temp_threshold'] = {};
				}
				decoded_data['probe_temp_threshold']['probe_temp_high'] = decode_field(arg, 2, 15, 8, "signed");
				decoded_data['probe_temp_threshold']['probe_temp_low'] = decode_field(arg, 2, 7, 0, "signed");
				return 2;
			}
		},
		{
			key: [0x48],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['probe_voltage_threshold_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['probe_voltage_threshold_enabled'] = "Enable";
						break;
					default:
						decoded_data['probe_voltage_threshold_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x4A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('battery_tx')) {
					decoded_data['battery_tx'] = {};
				}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_tx']['report_capacity_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['battery_tx']['report_capacity_enabled'] = "Enable";
						break;
					default:
						decoded_data['battery_tx']['report_capacity_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_tx']['report_lifetime_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['battery_tx']['report_lifetime_enabled'] = "Enable";
						break;
					default:
						decoded_data['battery_tx']['report_lifetime_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x4B],
			fn: function(arg) { 
				decoded_data['avg_energy_trend_window'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x50],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('accelerometer_mode')) {
					decoded_data['accelerometer_mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_mode']['xaxis_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer_mode']['xaxis_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer_mode']['xaxis_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_mode']['yaxis_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer_mode']['yaxis_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer_mode']['yaxis_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_mode']['zaxis_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer_mode']['zaxis_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer_mode']['zaxis_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_mode']['poweron'] = "Off";
						break;
					case 1:
						decoded_data['accelerometer_mode']['poweron'] = "On";
						break;
					default:
						decoded_data['accelerometer_mode']['poweron'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x51],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('accelerometer_sensitivity')) {
					decoded_data['accelerometer_sensitivity'] = {};
				}
				var val = decode_field(arg, 1, 2, 0, "unsigned");
				{switch (val){
					case 1:
						decoded_data['accelerometer_sensitivity']['sample_rate'] = "1 Hz";
						break;
					case 2:
						decoded_data['accelerometer_sensitivity']['sample_rate'] = "10 Hz";
						break;
					case 3:
						decoded_data['accelerometer_sensitivity']['sample_rate'] = "25 Hz";
						break;
					case 4:
						decoded_data['accelerometer_sensitivity']['sample_rate'] = "50 Hz";
						break;
					case 5:
						decoded_data['accelerometer_sensitivity']['sample_rate'] = "100 Hz";
						break;
					case 6:
						decoded_data['accelerometer_sensitivity']['sample_rate'] = "200 Hz";
						break;
					case 7:
						decoded_data['accelerometer_sensitivity']['sample_rate'] = "400 Hz";
						break;
					default:
						decoded_data['accelerometer_sensitivity']['sample_rate'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_sensitivity']['measurement_range'] = "+/- 2g";
						break;
					case 1:
						decoded_data['accelerometer_sensitivity']['measurement_range'] = "+/- 4g";
						break;
					case 2:
						decoded_data['accelerometer_sensitivity']['measurement_range'] = "+/- 8g";
						break;
					case 3:
						decoded_data['accelerometer_sensitivity']['measurement_range'] = "+/- 16g";
						break;
					default:
						decoded_data['accelerometer_sensitivity']['measurement_range'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x52],
			fn: function(arg) { 
				decoded_data['acceleration_event_threshold_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x53],
			fn: function(arg) { 
				decoded_data['acceleration_event_threshold_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x54],
			fn: function(arg) { 
				decoded_data['acceleration_event_threshold'] = (decode_field(arg, 2, 15, 0, "unsigned") * 0.001).toFixed(3);
				return 2;
			}
		},
		{
			key: [0x55],
			fn: function(arg) { 
				decoded_data['accelertaion_event_grace_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x56],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('acceleration_event_tx')) {
					decoded_data['acceleration_event_tx'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_event_tx']['acceleration_alarm'] = "Disable";
						break;
					case 1:
						decoded_data['acceleration_event_tx']['acceleration_alarm'] = "Enable";
						break;
					default:
						decoded_data['acceleration_event_tx']['acceleration_alarm'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_event_tx']['ambient_temp'] = "Disable";
						break;
					case 1:
						decoded_data['acceleration_event_tx']['ambient_temp'] = "Enable";
						break;
					default:
						decoded_data['acceleration_event_tx']['ambient_temp'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_event_tx']['ambient_rh'] = "Disable";
						break;
					case 1:
						decoded_data['acceleration_event_tx']['ambient_rh'] = "Enable";
						break;
					default:
						decoded_data['acceleration_event_tx']['ambient_rh'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_event_tx']['analog_probe'] = "Disable";
						break;
					case 1:
						decoded_data['acceleration_event_tx']['analog_probe'] = "Enable";
						break;
					default:
						decoded_data['acceleration_event_tx']['analog_probe'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_event_tx']['mcu_temp'] = "Disable";
						break;
					case 1:
						decoded_data['acceleration_event_tx']['mcu_temp'] = "Enable";
						break;
					default:
						decoded_data['acceleration_event_tx']['mcu_temp'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x71],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('metadata')) {
					decoded_data['metadata'] = {};
				}
				decoded_data['metadata']['app_major_version'] = decode_field(arg, 7, 55, 48, "unsigned");
				decoded_data['metadata']['app_minor_version'] = decode_field(arg, 7, 47, 40, "unsigned");
				decoded_data['metadata']['app_revision'] = decode_field(arg, 7, 39, 32, "unsigned");
				decoded_data['metadata']['loramac_major_version'] = decode_field(arg, 7, 31, 24, "unsigned");
				decoded_data['metadata']['loramac_minor_version'] = decode_field(arg, 7, 23, 16, "unsigned");
				decoded_data['metadata']['loramac_revision'] = decode_field(arg, 7, 15, 8, "unsigned");
				var val = decode_field(arg, 7, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['metadata']['region'] = "EU868";
						break;
					case 1:
						decoded_data['metadata']['region'] = "US915";
						break;
					case 2:
						decoded_data['metadata']['region'] = "AS923";
						break;
					case 3:
						decoded_data['metadata']['region'] = "AU915";
						break;
					case 4:
						decoded_data['metadata']['region'] = "IN865";
						break;
					case 5:
						decoded_data['metadata']['region'] = "CN470";
						break;
					case 6:
						decoded_data['metadata']['region'] = "KR920";
						break;
					case 7:
						decoded_data['metadata']['region'] = "RU864";
						break;
					case 8:
						decoded_data['metadata']['region'] = "DN915";
						break;
					default:
						decoded_data['metadata']['region'] = "Invalid";
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
