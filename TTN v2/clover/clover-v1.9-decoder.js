//DCG: v1.0.0
function Decoder(bytes, port) {
var decoded_data = {};
var decoder = [];
bytes = convertToUint8Array(bytes);
decoded_data['raw'] = toHexString(bytes).toUpperCase();
decoded_data['port'] = port;

if(port === 101){
	decoder = [
		{
			key: [],
			fn: function(arg) { 
				var size = arg.length;
				var invalid_registers = [];
				var responses = [];
				while(arg.length > 0){
					const downlink_fcnt = arg[0];
					const num_invalid_writes = arg[1];
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

if (port === 100) {
	decoder = [
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
				var val = decode_field(arg, 2, 15, 12, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts']['lora_class'] = "Class A";
						break;
					case 12:
						decoded_data['loramac_opts']['lora_class'] = "Class C";
						break;
					default:
						decoded_data['loramac_opts']['lora_class'] = "Invalid";
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
				decoded_data['loramac_dr_tx']['tx_power_number'] = decode_field(arg, 2, 3, 0, "unsigned");
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
				decoded_data['tick_per_light'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x25],
			fn: function(arg) { 
				decoded_data['tick_per_input1'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x26],
			fn: function(arg) { 
				decoded_data['tick_per_input2'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x27],
			fn: function(arg) { 
				decoded_data['tick_per_input3'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x28],
			fn: function(arg) { 
				decoded_data['tick_per_input4'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x29],
			fn: function(arg) { 
				decoded_data['tick_per_watermark1'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2A],
			fn: function(arg) { 
				decoded_data['tick_per_watermark2'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2C],
			fn: function(arg) { 
				decoded_data['tick_per_accelerometer'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2D],
			fn: function(arg) { 
				decoded_data['tick_per_orientation_alarm'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2E],
			fn: function(arg) { 
				decoded_data['tick_per_mcu_temperature'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2F],
			fn: function(arg) { 
				decoded_data['tick_per_barometer_pressure'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x30],
			fn: function(arg) { 
				decoded_data['temperature_relative_humidity_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x31],
			fn: function(arg) { 
				decoded_data['temperature_relative_humidity_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x32],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('temp_thresholds')) {
					decoded_data['temp_thresholds'] = {};
				}
				decoded_data['temp_thresholds']['high_ambient_temp'] = decode_field(arg, 2, 15, 8, "signed");
				decoded_data['temp_thresholds']['low_ambient_temp'] = decode_field(arg, 2, 7, 0, "signed");
				return 2;
			}
		},
		{
			key: [0x33],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ambient_temperature_threshold_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['ambient_temperature_threshold_enabled'] = "Enabled";
						break;
					default:
						decoded_data['ambient_temperature_threshold_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x34],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('rh_threshold')) {
					decoded_data['rh_threshold'] = {};
				}
				decoded_data['rh_threshold']['high_rh'] = decode_field(arg, 2, 15, 8, "unsigned");
				decoded_data['rh_threshold']['low_rh'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x35],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['relative_humidity_threshold_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['relative_humidity_threshold_enabled'] = "Enabled";
						break;
					default:
						decoded_data['relative_humidity_threshold_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x36],
			fn: function(arg) { 
				decoded_data['input_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x37],
			fn: function(arg) { 
				decoded_data['input_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x38],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('input1')) {
					decoded_data['input1'] = {};
				}
				decoded_data['input1']['high_input1'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['input1']['low_input1'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x39],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('input2')) {
					decoded_data['input2'] = {};
				}
				decoded_data['input2']['high_input2'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['input2']['low_input2'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('input3')) {
					decoded_data['input3'] = {};
				}
				decoded_data['input3']['high_input3'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['input3']['low_input3'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3B],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('input4')) {
					decoded_data['input4'] = {};
				}
				decoded_data['input4']['high_input4'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['input4']['low_input4'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3C],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('watermark1')) {
					decoded_data['watermark1'] = {};
				}
				decoded_data['watermark1']['high_watermark1'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['watermark1']['low_watermark1'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('watermark2')) {
					decoded_data['watermark2'] = {};
				}
				decoded_data['watermark2']['high_watermark2'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['watermark2']['low_watermark2'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3F],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('input_enable')) {
					decoded_data['input_enable'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['input_enable']['input1'] = "Disabled";
						break;
					case 1:
						decoded_data['input_enable']['input1'] = "Enabled";
						break;
					default:
						decoded_data['input_enable']['input1'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['input_enable']['input2'] = "Disabled";
						break;
					case 1:
						decoded_data['input_enable']['input2'] = "Enabled";
						break;
					default:
						decoded_data['input_enable']['input2'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['input_enable']['input3'] = "Disabled";
						break;
					case 1:
						decoded_data['input_enable']['input3'] = "Enabled";
						break;
					default:
						decoded_data['input_enable']['input3'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['input_enable']['input4'] = "Disabled";
						break;
					case 1:
						decoded_data['input_enable']['input4'] = "Enabled";
						break;
					default:
						decoded_data['input_enable']['input4'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['input_enable']['watermark1'] = "Disabled";
						break;
					case 1:
						decoded_data['input_enable']['watermark1'] = "Enabled";
						break;
					default:
						decoded_data['input_enable']['watermark1'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['input_enable']['watermark2'] = "Disabled";
						break;
					case 1:
						decoded_data['input_enable']['watermark2'] = "Enabled";
						break;
					default:
						decoded_data['input_enable']['watermark2'] = "Invalid";
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
				if(!decoded_data.hasOwnProperty('mcu_temperature')) {
					decoded_data['mcu_temperature'] = {};
				}
				decoded_data['mcu_temperature']['high_mcu_temp'] = decode_field(arg, 2, 15, 8, "unsigned");
				decoded_data['mcu_temperature']['low_mcu_temp'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x43],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mcu_temperature_enable'] = "Disabled";
						break;
					case 1:
						decoded_data['mcu_temperature_enable'] = "Enabled";
						break;
					default:
						decoded_data['mcu_temperature_enable'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x44],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('input3_thresh')) {
					decoded_data['input3_thresh'] = {};
				}
				decoded_data['input3_thresh']['high_input3_onewire'] = decode_field(arg, 2, 15, 8, "signed");
				decoded_data['input3_thresh']['low_input3_onewire'] = decode_field(arg, 2, 7, 0, "signed");
				return 2;
			}
		},
		{
			key: [0x45],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('input4_thresh')) {
					decoded_data['input4_thresh'] = {};
				}
				decoded_data['input4_thresh']['high_input4_onewire'] = decode_field(arg, 2, 15, 8, "signed");
				decoded_data['input4_thresh']['low_input4_onewire'] = decode_field(arg, 2, 7, 0, "signed");
				return 2;
			}
		},
		{
			key: [0x48],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['interrupt_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['interrupt_enabled'] = "Enabled";
						break;
					default:
						decoded_data['interrupt_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x49],
			fn: function(arg) { 
				decoded_data['upper_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x4A],
			fn: function(arg) { 
				decoded_data['lower_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x4B],
			fn: function(arg) { 
				decoded_data['light_sample_period_inactive'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x4C],
			fn: function(arg) { 
				decoded_data['light_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x4D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('values_to_report')) {
					decoded_data['values_to_report'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_report']['light_alarm_reported'] = "Ignore";
						break;
					case 1:
						decoded_data['values_to_report']['light_alarm_reported'] = "Report";
						break;
					default:
						decoded_data['values_to_report']['light_alarm_reported'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_report']['light_intensity_reported'] = "Ignore";
						break;
					case 1:
						decoded_data['values_to_report']['light_intensity_reported'] = "Report";
						break;
					default:
						decoded_data['values_to_report']['light_intensity_reported'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x50],
			fn: function(arg) { 
				decoded_data['orientation_alarm_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x51],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('report')) {
					decoded_data['report'] = {};
				}
				var val = decode_field(arg, 1, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['report']['orientation_vector_report'] = "Ignore";
						break;
					case 1:
						decoded_data['report']['orientation_vector_report'] = "Report";
						break;
					default:
						decoded_data['report']['orientation_vector_report'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['report']['orientation_alarm_report'] = "Ignore";
						break;
					case 1:
						decoded_data['report']['orientation_alarm_report'] = "Report";
						break;
					default:
						decoded_data['report']['orientation_alarm_report'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x52],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('mode')) {
					decoded_data['mode'] = {};
				}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode']['accelerometer_power_on'] = "Off";
						break;
					case 1:
						decoded_data['mode']['accelerometer_power_on'] = "On";
						break;
					default:
						decoded_data['mode']['accelerometer_power_on'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode']['orientation_alarm_mode'] = "Disabled";
						break;
					case 1:
						decoded_data['mode']['orientation_alarm_mode'] = "Enabled";
						break;
					default:
						decoded_data['mode']['orientation_alarm_mode'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x61],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('battery_reports')) {
					decoded_data['battery_reports'] = {};
				}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_reports']['report_capacity_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['battery_reports']['report_capacity_enabled'] = "Enabled";
						break;
					default:
						decoded_data['battery_reports']['report_capacity_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_reports']['report_lifetime_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['battery_reports']['report_lifetime_enabled'] = "Enabled";
						break;
					default:
						decoded_data['battery_reports']['report_lifetime_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x62],
			fn: function(arg) { 
				decoded_data['avg_current_window'] = decode_field(arg, 1, 7, 0, "unsigned");
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
						decoded_data['metadata']['region'] = "US916";
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
					case 6:
						decoded_data['metadata']['region'] = "KR920";
						break;
					case 7:
						decoded_data['metadata']['region'] = "RU864";
						break;
					default:
						decoded_data['metadata']['region'] = "Invalid";
				}}
				return 7;
			}
		},
	];
}
if (port === 10) {
	decoder = [
		{
			key: [0x00, 0xD3],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('battery_status')) {
					decoded_data['battery_status'] = {};
				}
				decoded_data['battery_status']['rem_batt_capacity'] = decode_field(arg, 1, 6, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x00, 0xBD],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('battery_status')) {
					decoded_data['battery_status'] = {};
				}
				decoded_data['battery_status']['rem_batt_days'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x01, 0x04],
			fn: function(arg) { 
				var val = decode_field(arg, 2, 15, 0, "unsigned");
				var output = 0;
				if (val > 2781){
					output = "Dry";
				} else if (val > 2776 && val <= 2781){
					output = 0.1;
				} else if (val > 2771 && val <= 2776){
					output = 0.2;
				} else if (val > 2766 && val <= 2771){
					output = 0.3;
				} else if (val > 2761 && val <= 2766){
					output = 0.4;
				} else if (val > 2756 && val <= 2761){
					output = 0.5;
				} else if (val > 2751 && val <= 2756){
					output = 0.6;
				} else if (val > 2746 && val <= 2751){
					output = 0.7;
				} else if (val > 2741 && val <= 2746){
					output = 0.8;
				} else if (val > 2736 && val <= 2741){
					output = 0.9;
				} else if (val > 2731 && val <= 2736){
					output = 1.0;
				} else if (val > 2726 && val <= 2731){
					output = 1.1;
				} else if (val > 2721 && val <= 2726){
					output = 1.2;
				} else {
					output = "Wet";
				}
				decoded_data['soil_moisture'] = output;
				decoded_data['soil_moisture_raw'] = val;
				return 2;
			}
		},
		{
			key: [0x02, 0x02],
			fn: function(arg) { 
				var val = decode_field(arg, 2, 15, 0, "unsigned");
				var output = 2.39e-5 * Math.pow(val, 2) - 0.1011 * val + 77.34;
				decoded_data['soil_temperature'] = output;
				decoded_data['soil_temperature_raw'] = val;
				return 2;
			}
		},
		{
			key: [0x03, 0x02],
			fn: function(arg) { 
				var val = decode_field(arg, 2, 15, 0, "unsigned");
				decoded_data['Input3_voltage'] = val;
				decoded_data['Input3_voltage_temp'] = (3.413e-7 * Math.pow(val, 4)) + (-0.0001843 * Math.pow(val, 3)) 
				+ (0.03493 * Math.pow(val, 2)) + (-3.017*val) + 98.5;
				return 2;
			}
		},
		{
			key: [0x03, 0x67],
			fn: function(arg) { 
				decoded_data['Input3_temperature'] = (decode_field(arg, 2, 15, 0, "signed")*0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x04, 0x02],
			fn: function(arg) { 
				var val = decode_field(arg, 2, 15, 0, "unsigned");
				decoded_data['Input4_voltage'] = val;
				decoded_data['Input4_voltage_temp'] = (3.413e-7 * Math.pow(val, 4)) + (-0.0001843 * Math.pow(val, 3)) 
				+ (0.03493 * Math.pow(val, 2)) + (-3.017*val) + 98.5;
				return 2;
			}
		},
		{
			key: [0x04, 0x67],
			fn: function(arg) { 
				decoded_data['Input4_temperature'] = (decode_field(arg, 2, 15, 0, "signed")*0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x05, 0x04],
			fn: function(arg) { 
				decoded_data['watermark1_tension'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x06, 0x04],
			fn: function(arg) { 
				decoded_data['watermark2_tension'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x09, 0x65],
			fn: function(arg) { 
				decoded_data['light_intensity'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x09, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['light_detected'] = "No Alarm";
						break;
					case 255:
						decoded_data['light_detected'] = "Alarm";
						break;
					default:
						decoded_data['light_detected'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x0A, 0x71],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('accelerometer_data')) {
					decoded_data['accelerometer_data'] = {};
				}
				decoded_data['accelerometer_data']['xaxis'] = (decode_field(arg, 6, 47, 32, "signed") * 0.001).toFixed(3);
				decoded_data['accelerometer_data']['yaxis'] = (decode_field(arg, 6, 31, 16, "signed") * 0.001).toFixed(3);
				decoded_data['accelerometer_data']['zaxis'] = (decode_field(arg, 6, 15, 0, "signed") * 0.001).toFixed(3);
				return 6;
			}
		},
		{
			key: [0x0A, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['orientation_alarm'] = "No Alarm";
						break;
					case 255:
						decoded_data['orientation_alarm'] = "Alarm";
						break;
					default:
						decoded_data['orientation_alarm'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x0B, 0x67],
			fn: function(arg) { 
				decoded_data['ambient_temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x0B, 0x68],
			fn: function(arg) { 
				decoded_data['relative_humidity'] = (decode_field(arg, 1, 7, 0, "unsigned") * 0.5).toFixed(1);
				return 1;
			}
		},
		{
			key: [0x0C, 0x67],
			fn: function(arg) { 
				decoded_data['mcu_temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x0D, 0x73],
			fn: function(arg) { 
				decoded_data['barometric_pressure'] = (decode_field(arg, 2, 15, 0, "unsigned") * 0.1).toFixed(1);
				return 2;
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
				decoded_data['error'] = "Unable to decode header " + toHexString(header).toUpperCase();
				break;
			}
		}
	} catch (error) {
		decoded_data['error'] = "Fatal decoder error";
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
	return decoded_data;
}