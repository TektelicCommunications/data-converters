function decodeUplink(input){

	var decoded_data = {};
	var decoder = [];
	var errors = [];
	var bytes = convertToUint8Array(input.bytes);
	decoded_data['raw'] = toHexString(bytes).toUpperCase();
	decoded_data['fPort'] = input.fPort;

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

if (input.fPort === 10) {
	decoder = [
		{
			key: [0x00, 0xD3],
			fn: function(arg) { 
				decoded_data['battery_lifetime_pct'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x00, 0xBD],
			fn: function(arg) { 
				decoded_data['battery_lifetime_dys'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x00, 0x95],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('geolocation_cycle_failed')) {
					decoded_data['geolocation_cycle_failed'] = {};
				}
				var val = decode_field(arg, 1, 1, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['geolocation_cycle_failed']['lpgnss_scan'] = "Scan failed";
						break;
					case 3:
						decoded_data['geolocation_cycle_failed']['lpgnss_scan'] = "Scan successful/not done";
						break;
					default:
						decoded_data['geolocation_cycle_failed']['lpgnss_scan'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['geolocation_cycle_failed']['wifi_scan'] = "Scan failed";
						break;
					case 1:
						decoded_data['geolocation_cycle_failed']['wifi_scan'] = "Scan successful/not done";
						break;
					default:
						decoded_data['geolocation_cycle_failed']['wifi_scan'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['geolocation_cycle_failed']['ble_scan'] = "Scan failed";
						break;
					case 1:
						decoded_data['geolocation_cycle_failed']['ble_scan'] = "Scan successful/not done";
						break;
					default:
						decoded_data['geolocation_cycle_failed']['ble_scan'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['geolocation_cycle_failed']['duty_cycle_UL'] = "Duty Cycle Restrictions";
						break;
					case 1:
						decoded_data['geolocation_cycle_failed']['duty_cycle_UL'] = "No Duty Cycle Restriction Impacts";
						break;
					default:
						decoded_data['geolocation_cycle_failed']['duty_cycle_UL'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 6, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['geolocation_cycle_failed']['gnss_scan'] = "Scan failed";
						break;
					case 3:
						decoded_data['geolocation_cycle_failed']['gnss_scan'] = "Scan successful/not done";
						break;
					default:
						decoded_data['geolocation_cycle_failed']['gnss_scan'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x00, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_alarm'] = "No motion";
						break;
					case 255:
						decoded_data['acceleration_alarm'] = "Motion detected";
						break;
					default:
						decoded_data['acceleration_alarm'] = "Invalid";
				}}
				decoded_data['gnss_fix'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x00, 0x71],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('acceleration_vector')) {
					decoded_data['acceleration_vector'] = {};
				}
				decoded_data['acceleration_vector']['xaxis'] = (decode_field(arg, 6, 47, 32, "signed") * 0.001).toFixed(3);
				decoded_data['acceleration_vector']['yaxis'] = (decode_field(arg, 6, 31, 16, "signed") * 0.001).toFixed(3);
				decoded_data['acceleration_vector']['zaxis'] = (decode_field(arg, 6, 15, 0, "signed") * 0.001).toFixed(3);
				return 6;
			}
		},
		{
			key: [0x03, 0x67],
			fn: function(arg) { 
				decoded_data['temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x00, 0x85],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('utc_timestamp')) {
					decoded_data['utc_timestamp'] = {};
				}
				decoded_data['utc_timestamp']['year_utc'] = decode_field(arg, 4, 31, 26, "unsigned");
				decoded_data['utc_timestamp']['month_utc'] = decode_field(arg, 4, 25, 22, "unsigned");
				decoded_data['utc_timestamp']['day_utc'] = decode_field(arg, 4, 21, 17, "unsigned");
				decoded_data['utc_timestamp']['hour_utc'] = decode_field(arg, 4, 16, 12, "unsigned");
				decoded_data['utc_timestamp']['minute_utc'] = decode_field(arg, 4, 11, 6, "unsigned");
				decoded_data['utc_timestamp']['second_utc'] = decode_field(arg, 4, 5, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x00, 0x88],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('coordinates')) {
					decoded_data['coordinates'] = {};
				}
				decoded_data['coordinates']['latitude'] = (decode_field(arg, 8, 63, 40, "signed") * (90 / Math.pow(2, 23))).toFixed(7);
				decoded_data['coordinates']['longitude'] = (decode_field(arg, 8, 39, 16, "signed") * (180 / Math.pow(2, 23))).toFixed(7);
				decoded_data['coordinates']['altitude'] = (decode_field(arg, 8, 15, 0, "unsigned") * (9500 / 65536) + 500).toFixed(2);
				return 8;
			}
		},
		{
			key: [0x00, 0x92],
			fn: function(arg) { 
				decoded_data['ground_speed'] = (decode_field(arg, 1, 7, 0, "unsigned") * 0.27778).toFixed(3);
				return 1;
			}
		},
	];
}
if (input.fPort === 16) {
	decoder = [
		{
			key: [0x0D, 0x3C],
			fn: function(arg) { 
				decoded_data['num_satellites'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x0D, 0x64],
			fn: function(arg) { 
				decoded_data['avg_satellite_snr'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x0D, 0x63],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('min_max_satellite_snr')) {
					decoded_data['min_max_satellite_snr'] = {};
				}
				decoded_data['min_max_satellite_snr']['max_satellite_snr'] = (decode_field(arg, 4, 31, 16, "signed") * 0.1).toFixed(1);
				decoded_data['min_max_satellite_snr']['min_satellite_snr'] = (decode_field(arg, 4, 15, 0, "signed") * 0.1).toFixed(1);
				return 4;
			}
		},
		{
			key: [0x0D, 0x0F],
			fn: function(arg) { 
				decoded_data['log_num'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x0D, 0x95],
			fn: function(arg) { 
				decoded_data['fix_type'] = decode_field(arg, 1, 1, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x0D, 0x96],
			fn: function(arg) { 
				decoded_data['time_to_fix'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x0D, 0x97],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('gnss_fix_accuracy')) {
					decoded_data['gnss_fix_accuracy'] = {};
				}
				decoded_data['gnss_fix_accuracy']['gnss_vertical_accuracy'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['gnss_fix_accuracy']['gnss_horizontal_accuracy'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x0D, 0x98],
			fn: function(arg) { 
				decoded_data['ground_speed_accuracy'] = (decode_field(arg, 4, 31, 0, "unsigned") * 0.001).toFixed(3);
				return 4;
			}
		},
		{
			key: [0x0D, 0x99],
			fn: function(arg) { 
				decoded_data['num_of_fixes'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
	];
}
if (input.fPort === 25) {
	decoder = [
		{
			key: [0x0A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('basic_report')) {
					decoded_data['basic_report'] = {};
				}
					var data = [];
					var loop = arg.length / 7;
					for (var i = 0; i < loop; i++) {
						var group = {};
						group['BD_ADDR_0'] = decode_field(arg, 7, 55, 8, "hexstring");
						data.push(group);
						arg = arg.slice(7);
					}
					decoded_data['basic_report'] = data;
					return loop*7;
			}
		},
		{
			key: [0xB0],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('filter_report_0')) {
					decoded_data['filter_report_0'] = {};
				}
					var data = [];
					var loop = arg.length / 4;
					for (var i = 0; i < loop; i++) {
						var group = {};
						group['BD_ADDR_1'] = decode_field(arg, 4, 31, 8, "hexstring");
						data.push(group);
						arg = arg.slice(4);
					}
					decoded_data['filter_report_0'] = data;
					return loop*4;
			}
		},
		{
			key: [0xB1],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('filter_report_1')) {
					decoded_data['filter_report_1'] = {};
				}
					var data = [];
					var loop = arg.length / 4;
					for (var i = 0; i < loop; i++) {
						var group = {};
						group['BD_ADDR_2'] = decode_field(arg, 4, 31, 8, "hexstring");
						data.push(group);
						arg = arg.slice(4);
					}
					decoded_data['filter_report_1'] = data;
					return loop*4;
			}
		},
		{
			key: [0xB2],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('filter_report_2')) {
					decoded_data['filter_report_2'] = {};
				}
					var data = [];
					var loop = arg.length / 4;
					for (var i = 0; i < loop; i++) {
						var group = {};
						group['BD_ADDR_3'] = decode_field(arg, 4, 31, 8, "hexstring");
						data.push(group);
						arg = arg.slice(4);
					}
					decoded_data['filter_report_2'] = data;
					return loop*4;
			}
		},
		{
			key: [0xB3],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('filter_report_3')) {
					decoded_data['filter_report_3'] = {};
				}
					var data = [];
					var loop = arg.length / 4;
					for (var i = 0; i < loop; i++) {
						var group = {};
						group['BD_ADDR_4'] = decode_field(arg, 4, 31, 8, "hexstring");
						data.push(group);
						arg = arg.slice(4);
					}
					decoded_data['filter_report_3'] = data;
					return loop*4;
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
				decoded_data['seconds_per_core_tick'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x21],
			fn: function(arg) { 
				decoded_data['ticks_per_battery'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x22],
			fn: function(arg) { 
				decoded_data['ticks_per_geolocation_update_stillness'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x23],
			fn: function(arg) { 
				decoded_data['ticks_per_geolocation_update_mobility'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x24],
			fn: function(arg) { 
				decoded_data['ticks_per_geolocation_update_emergency'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x25],
			fn: function(arg) { 
				decoded_data['ticks_per_accelerometer'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x26],
			fn: function(arg) { 
				decoded_data['ticks_per_MCU_temp'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x30],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('geolocation_strategy')) {
					decoded_data['geolocation_strategy'] = {};
				}
				var val = decode_field(arg, 1, 1, 0, "unsigned");
				{switch (val){
					case 1:
						decoded_data['geolocation_strategy']['scan_1'] = "BLE";
						break;
					case 2:
						decoded_data['geolocation_strategy']['scan_1'] = "WIFI";
						break;
					case 3:
						decoded_data['geolocation_strategy']['scan_1'] = "LPGNSS";
						break;
					default:
						decoded_data['geolocation_strategy']['scan_1'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 3, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['geolocation_strategy']['scan_2'] = "Not defined";
						break;
					case 1:
						decoded_data['geolocation_strategy']['scan_2'] = "BLE";
						break;
					case 2:
						decoded_data['geolocation_strategy']['scan_2'] = "WIFI";
						break;
					case 3:
						decoded_data['geolocation_strategy']['scan_2'] = "LPGNSS";
						break;
					default:
						decoded_data['geolocation_strategy']['scan_2'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['geolocation_strategy']['scan_3'] = "Not defined";
						break;
					case 1:
						decoded_data['geolocation_strategy']['scan_3'] = "BLE";
						break;
					case 2:
						decoded_data['geolocation_strategy']['scan_3'] = "WIFI";
						break;
					case 3:
						decoded_data['geolocation_strategy']['scan_3'] = "LPGNSS";
						break;
					default:
						decoded_data['geolocation_strategy']['scan_3'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['geolocation_strategy']['scan_order_logic'] = "A";
						break;
					case 1:
						decoded_data['geolocation_strategy']['scan_order_logic'] = "B";
						break;
					case 2:
						decoded_data['geolocation_strategy']['scan_order_logic'] = "C";
						break;
					case 3:
						decoded_data['geolocation_strategy']['scan_order_logic'] = "D";
						break;
					default:
						decoded_data['geolocation_strategy']['scan_order_logic'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x36],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('assist_coordinates')) {
					decoded_data['assist_coordinates'] = {};
				}
				decoded_data['assist_coordinates']['latitude_lpgnss'] = (decode_field(arg, 8, 63, 40, "unsigned") * 1.07E-05).toFixed(7);
				decoded_data['assist_coordinates']['longitude_lpgnss'] = (decode_field(arg, 8, 39, 16, "unsigned") * 2.15E-05).toFixed(7);
				var val = decode_field(arg, 8, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['assist_coordinates']['enabled_lpgnss'] = "Disable";
						break;
					case 1:
						decoded_data['assist_coordinates']['enabled_lpgnss'] = "Enable";
						break;
					default:
						decoded_data['assist_coordinates']['enabled_lpgnss'] = "Invalid";
				}}
				return 8;
			}
		},
		{
			key: [0x3F],
			fn: function(arg) { 
				decoded_data['gnss_receiver'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x40],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('accelerometer_mode')) {
					decoded_data['accelerometer_mode'] = {};
				}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_mode']['power_on'] = "Off";
						break;
					case 1:
						decoded_data['accelerometer_mode']['power_on'] = "On";
						break;
					default:
						decoded_data['accelerometer_mode']['power_on'] = "Invalid";
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
				return 1;
			}
		},
		{
			key: [0x41],
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
						decoded_data['accelerometer_sensitivity']['measurement_range'] = "2g";
						break;
					case 1:
						decoded_data['accelerometer_sensitivity']['measurement_range'] = "4g";
						break;
					case 2:
						decoded_data['accelerometer_sensitivity']['measurement_range'] = "8g";
						break;
					case 3:
						decoded_data['accelerometer_sensitivity']['measurement_range'] = "16g";
						break;
					default:
						decoded_data['accelerometer_sensitivity']['measurement_range'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x42],
			fn: function(arg) { 
				decoded_data['accl_trigger_threshold_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x43],
			fn: function(arg) { 
				decoded_data['accl_trigger_thrsehold_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x44],
			fn: function(arg) { 
				decoded_data['accl_trigger_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x45],
			fn: function(arg) { 
				decoded_data['accl_event_grace_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x46],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('accl_tx')) {
					decoded_data['accl_tx'] = {};
				}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accl_tx']['accl_assist'] = "Disable";
						break;
					case 1:
						decoded_data['accl_tx']['accl_assist'] = "Enable";
						break;
					default:
						decoded_data['accl_tx']['accl_assist'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accl_tx']['accl_alarms'] = "Disable";
						break;
					case 1:
						decoded_data['accl_tx']['accl_alarms'] = "Enable";
						break;
					default:
						decoded_data['accl_tx']['accl_alarms'] = "Invalid";
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
			key: [0x50],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ble_mode')) {
					decoded_data['ble_mode'] = {};
				}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ble_mode']['averaging_mode'] = "Disable";
						break;
					case 1:
						decoded_data['ble_mode']['averaging_mode'] = "Enable";
						break;
					default:
						decoded_data['ble_mode']['averaging_mode'] = "Invalid";
				}}
				decoded_data['ble_mode']['num_reported_devices'] = decode_field(arg, 1, 6, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x51],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ble_scan_duration')) {
					decoded_data['ble_scan_duration'] = {};
				}
				decoded_data['ble_scan_duration']['periodic'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x52],
			fn: function(arg) { 
				decoded_data['ble_scan_interval'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x53],
			fn: function(arg) { 
				decoded_data['ble_scan_window'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x54],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('filter_range_0')) {
					decoded_data['filter_range_0'] = {};
				}
				decoded_data['filter_range_0']['oui_0'] = decode_field(arg, 9, 71, 48, "hexstring");
				decoded_data['filter_range_0']['lap_start_0'] = decode_field(arg, 9, 47, 24, "hexstring");
				decoded_data['filter_range_0']['lap_end_0'] = decode_field(arg, 9, 23, 0, "hexstring");
				return 9;
			}
		},
		{
			key: [0x55],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('filter_range_1')) {
					decoded_data['filter_range_1'] = {};
				}
				decoded_data['filter_range_1']['oui_1'] = decode_field(arg, 9, 71, 48, "hexstring");
				decoded_data['filter_range_1']['lap_start_1'] = decode_field(arg, 9, 47, 24, "hexstring");
				decoded_data['filter_range_1']['lap_end_1'] = decode_field(arg, 9, 23, 0, "hexstring");
				return 9;
			}
		},
		{
			key: [0x56],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('filter_range_2')) {
					decoded_data['filter_range_2'] = {};
				}
				decoded_data['filter_range_2']['oui_2'] = decode_field(arg, 9, 71, 48, "hexstring");
				decoded_data['filter_range_2']['lap_start_2'] = decode_field(arg, 9, 47, 24, "hexstring");
				decoded_data['filter_range_2']['lap_end_2'] = decode_field(arg, 9, 23, 0, "hexstring");
				return 9;
			}
		},
		{
			key: [0x57],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('filter_range_3')) {
					decoded_data['filter_range_3'] = {};
				}
				decoded_data['filter_range_3']['oui_3'] = decode_field(arg, 9, 71, 48, "hexstring");
				decoded_data['filter_range_3']['lap_start_3'] = decode_field(arg, 9, 47, 24, "hexstring");
				decoded_data['filter_range_3']['lap_end_3'] = decode_field(arg, 9, 23, 0, "hexstring");
				return 9;
			}
		},
		{
			key: [0x58],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['advertising_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['advertising_enabled'] = "Enable";
						break;
					default:
						decoded_data['advertising_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x59],
			fn: function(arg) { 
				decoded_data['min_advertising_interval'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x5B],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['tx_advertising_power'] = "0 dBm";
						break;
					case 1:
						decoded_data['tx_advertising_power'] = "-0.85 dBm";
						break;
					case 2:
						decoded_data['tx_advertising_power'] = "-1.8 dBm";
						break;
					case 3:
						decoded_data['tx_advertising_power'] = "-3.15 dBm";
						break;
					case 4:
						decoded_data['tx_advertising_power'] = "-4 dBm";
						break;
					case 5:
						decoded_data['tx_advertising_power'] = "-4.95 dBm";
						break;
					case 6:
						decoded_data['tx_advertising_power'] = "-5.9 dBm";
						break;
					case 7:
						decoded_data['tx_advertising_power'] = "-6.9 dBm";
						break;
					case 8:
						decoded_data['tx_advertising_power'] = "-7.8 dBm";
						break;
					case 9:
						decoded_data['tx_advertising_power'] = "-8.85 dBm";
						break;
					case 10:
						decoded_data['tx_advertising_power'] = "-9.9 dBm";
						break;
					case 11:
						decoded_data['tx_advertising_power'] = "-12.05 dBm";
						break;
					case 12:
						decoded_data['tx_advertising_power'] = "-14.1 dBm";
						break;
					case 13:
						decoded_data['tx_advertising_power'] = "-16.5 dBm";
						break;
					case 14:
						decoded_data['tx_advertising_power'] = "-20.85 dBm";
						break;
					case 15:
						decoded_data['tx_advertising_power'] = "-40 dBm";
						break;
					default:
						decoded_data['tx_advertising_power'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x5C],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('advertising_packet_format')) {
					decoded_data['advertising_packet_format'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['advertising_packet_format']['ibeacon'] = "Disable";
						break;
					case 1:
						decoded_data['advertising_packet_format']['ibeacon'] = "Enable";
						break;
					default:
						decoded_data['advertising_packet_format']['ibeacon'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['advertising_packet_format']['eddystone_uid'] = "Disable";
						break;
					case 1:
						decoded_data['advertising_packet_format']['eddystone_uid'] = "Enable";
						break;
					default:
						decoded_data['advertising_packet_format']['eddystone_uid'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['advertising_packet_format']['eddystone_tlm'] = "Disable";
						break;
					case 1:
						decoded_data['advertising_packet_format']['eddystone_tlm'] = "Enable";
						break;
					default:
						decoded_data['advertising_packet_format']['eddystone_tlm'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x5F],
			fn: function(arg) { 
				decoded_data['mac_address'] = decode_field(arg, 6, 47, 0, "hexstring");
				return 6;
			}
		},
		{
			key: [0x60],
			fn: function(arg) { 
				decoded_data['temp_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x61],
			fn: function(arg) { 
				decoded_data['temp_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x62],
			fn: function(arg) { 
				decoded_data['temp_threshold_high'] = decode_field(arg, 2, 15, 8, "signed");
				decoded_data['temp_threshold_low'] = decode_field(arg, 2, 7, 0, "signed");
				return 2;
			}
		},
		{
			key: [0x63],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "hexstring");
				{switch (val){
					case 0:
						decoded_data['temp_thresholds_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['temp_thresholds_enabled'] = "Enable";
						break;
					default:
						decoded_data['temp_thresholds_enabled'] = "Invalid";
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
					case 5:
						decoded_data['metadata']['loramac_region'] = "CN470";
						break;
					case 6:
						decoded_data['metadata']['loramac_region'] = "KR920";
						break;
					case 7:
						decoded_data['metadata']['loramac_region'] = "RU864";
						break;
					case 8:
						decoded_data['metadata']['loramac_region'] = "DN915";
						break;
					default:
						decoded_data['metadata']['loramac_region'] = "Invalid";
				}}
				return 7;
			}
		},
		{
			key: [0x73],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ble_metadata')) {
					decoded_data['ble_metadata'] = {};
				}
				decoded_data['ble_metadata']['stack_ver_major'] = decode_field(arg, 6, 23, 16, "unsigned");
				decoded_data['ble_metadata']['stack_ver_minor'] = decode_field(arg, 6, 15, 8, "unsigned");
				decoded_data['ble_metadata']['stack_ver_revision'] = decode_field(arg, 6, 7, 0, "unsigned");
				return 6;
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

    var output = {
        "data": decoded_data,
		"errors": errors,
		"warnings": [],
    };

    return output;
}
