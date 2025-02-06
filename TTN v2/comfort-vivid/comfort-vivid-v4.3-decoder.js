function Decoder(bytes, port) {
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
	
if (input.fPort === 100) {
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
				decoded_data['ticks_per_battery'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x22],
			fn: function(arg) { 
				decoded_data['ticks_per_ambient_temperature'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x23],
			fn: function(arg) { 
				decoded_data['ticks_per_relative_humidity'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x24],
			fn: function(arg) { 
				decoded_data['ticks_per_hall_effect'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x25],
			fn: function(arg) { 
				decoded_data['ticks_per_ambient_light'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x26],
			fn: function(arg) { 
				decoded_data['ticks_per_accelerometer'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x27],
			fn: function(arg) { 
				decoded_data['ticks_per_mcu_temperature'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x28],
			fn: function(arg) { 
				decoded_data['ticks_per_pir'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x55],
			fn: function(arg) { 
				decoded_data['ticks_per_external_connector_a'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x29],
			fn: function(arg) { 
				decoded_data['ticks_per_external_connector_b'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x5C],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('battery_report_opts')) {
					decoded_data['battery_report_opts'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_report_opts']['battery_voltage_report'] = "Disable";
						break;
					case 1:
						decoded_data['battery_report_opts']['battery_voltage_report'] = "Enable";
						break;
					default:
						decoded_data['battery_report_opts']['battery_voltage_report'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_report_opts']['battery_lifetime_pct_report'] = "Disable";
						break;
					case 1:
						decoded_data['battery_report_opts']['battery_lifetime_pct_report'] = "Enable";
						break;
					default:
						decoded_data['battery_report_opts']['battery_lifetime_pct_report'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x2A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('hall_effect_mode')) {
					decoded_data['hall_effect_mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hall_effect_mode']['rising_edge_enabled_hall'] = "Disable";
						break;
					case 1:
						decoded_data['hall_effect_mode']['rising_edge_enabled_hall'] = "Enable";
						break;
					default:
						decoded_data['hall_effect_mode']['rising_edge_enabled_hall'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hall_effect_mode']['falling_edge_enabled_hall'] = "Disable";
						break;
					case 1:
						decoded_data['hall_effect_mode']['falling_edge_enabled_hall'] = "Enable";
						break;
					default:
						decoded_data['hall_effect_mode']['falling_edge_enabled_hall'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x2B],
			fn: function(arg) { 
				decoded_data['hall_effect_count_threshold'] = decode_field(arg, 2, 13, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2C],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('hall_effect_report_options')) {
					decoded_data['hall_effect_report_options'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hall_effect_report_options']['report_state_enabled_hall'] = "Disable";
						break;
					case 1:
						decoded_data['hall_effect_report_options']['report_state_enabled_hall'] = "Enable";
						break;
					default:
						decoded_data['hall_effect_report_options']['report_state_enabled_hall'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hall_effect_report_options']['report_count_enabled_hall'] = "Disable";
						break;
					case 1:
						decoded_data['hall_effect_report_options']['report_count_enabled_hall'] = "Enable";
						break;
					default:
						decoded_data['hall_effect_report_options']['report_count_enabled_hall'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x4D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('external_a_mode')) {
					decoded_data['external_a_mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_a_mode']['rising_edge_enabled_ex_a'] = "Disable";
						break;
					case 1:
						decoded_data['external_a_mode']['rising_edge_enabled_ex_a'] = "Enable";
						break;
					default:
						decoded_data['external_a_mode']['rising_edge_enabled_ex_a'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_a_mode']['falling_edge_enabled_ex_a'] = "Disable";
						break;
					case 1:
						decoded_data['external_a_mode']['falling_edge_enabled_ex_a'] = "Enable";
						break;
					default:
						decoded_data['external_a_mode']['falling_edge_enabled_ex_a'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x2D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('external_b_mode')) {
					decoded_data['external_b_mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_b_mode']['rising_edge_enabled_ex_b'] = "Disable";
						break;
					case 1:
						decoded_data['external_b_mode']['rising_edge_enabled_ex_b'] = "Enable";
						break;
					default:
						decoded_data['external_b_mode']['rising_edge_enabled_ex_b'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_b_mode']['falling_edge_enabled_ex_b'] = "Disable";
						break;
					case 1:
						decoded_data['external_b_mode']['falling_edge_enabled_ex_b'] = "Enable";
						break;
					default:
						decoded_data['external_b_mode']['falling_edge_enabled_ex_b'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_b_mode']['connection_mode'] = "Digital";
						break;
					case 1:
						decoded_data['external_b_mode']['connection_mode'] = "Analog";
						break;
					default:
						decoded_data['external_b_mode']['connection_mode'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x56],
			fn: function(arg) { 
				decoded_data['external_connector_a_count_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2E],
			fn: function(arg) { 
				decoded_data['external_connector_b_count_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x4F],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('external_values_to_transmit_a')) {
					decoded_data['external_values_to_transmit_a'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_values_to_transmit_a']['report_state_enabled_ex_a'] = "Disable";
						break;
					case 1:
						decoded_data['external_values_to_transmit_a']['report_state_enabled_ex_a'] = "Enable";
						break;
					default:
						decoded_data['external_values_to_transmit_a']['report_state_enabled_ex_a'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_values_to_transmit_a']['report_count_enabled_ex_a'] = "Disable";
						break;
					case 1:
						decoded_data['external_values_to_transmit_a']['report_count_enabled_ex_a'] = "Enable";
						break;
					default:
						decoded_data['external_values_to_transmit_a']['report_count_enabled_ex_a'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_values_to_transmit_a']['count_type_a'] = "Relative";
						break;
					case 1:
						decoded_data['external_values_to_transmit_a']['count_type_a'] = "Total";
						break;
					default:
						decoded_data['external_values_to_transmit_a']['count_type_a'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x2F],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('external_values_to_transmit_b')) {
					decoded_data['external_values_to_transmit_b'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_values_to_transmit_b']['report_state_enabled_ex_b'] = "Disable";
						break;
					case 1:
						decoded_data['external_values_to_transmit_b']['report_state_enabled_ex_b'] = "Enable";
						break;
					default:
						decoded_data['external_values_to_transmit_b']['report_state_enabled_ex_b'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_values_to_transmit_b']['report_count_enabled_ex_b'] = "Disable";
						break;
					case 1:
						decoded_data['external_values_to_transmit_b']['report_count_enabled_ex_b'] = "Enable";
						break;
					default:
						decoded_data['external_values_to_transmit_b']['report_count_enabled_ex_b'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_values_to_transmit_b']['count_type_b'] = "Relative";
						break;
					case 1:
						decoded_data['external_values_to_transmit_b']['count_type_b'] = "Total";
						break;
					default:
						decoded_data['external_values_to_transmit_b']['count_type_b'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x57],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['digital_output_mode'] = "Disable";
						break;
					case 1:
						decoded_data['digital_output_mode'] = "Enable";
						break;
					default:
						decoded_data['digital_output_mode'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x58],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ssr_state'] = "Disable";
						break;
					case 1:
						decoded_data['ssr_state'] = "Enable";
						break;
					default:
						decoded_data['ssr_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x59],
			fn: function(arg) { 
				decoded_data['ssr_energization_duration'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x44],
			fn: function(arg) { 
				decoded_data['analog_input_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x45],
			fn: function(arg) { 
				decoded_data['analog_input_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x46],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('analog_threshold')) {
					decoded_data['analog_threshold'] = {};
				}
				decoded_data['analog_threshold']['high_analog_threshold'] = (decode_field(arg, 4, 31, 16, "unsigned") * 0.001).toFixed(3);
				decoded_data['analog_threshold']['low_analog_threshold'] = (decode_field(arg, 4, 15, 0, "unsigned") * 0.001).toFixed(3);
				return 4;
			}
		},
		{
			key: [0x4A],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['analog_input_threshold_status'] = "Disable";
						break;
					case 1:
						decoded_data['analog_input_threshold_status'] = "Enable";
						break;
					default:
						decoded_data['analog_input_threshold_status'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x50],
			fn: function(arg) { 
				decoded_data['pir_grace_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x51],
			fn: function(arg) { 
				decoded_data['pir_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x52],
			fn: function(arg) { 
				decoded_data['pir_threshold_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x53],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('pir_mode')) {
					decoded_data['pir_mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['pir_count_reported'] = "Disable";
						break;
					case 1:
						decoded_data['pir_mode']['pir_count_reported'] = "Enable";
						break;
					default:
						decoded_data['pir_mode']['pir_count_reported'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['pir_state_reported'] = "Disable";
						break;
					case 1:
						decoded_data['pir_mode']['pir_state_reported'] = "Enable";
						break;
					default:
						decoded_data['pir_mode']['pir_state_reported'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['pir_value_reported'] = "Disable";
						break;
					case 1:
						decoded_data['pir_mode']['pir_value_reported'] = "Enable";
						break;
					default:
						decoded_data['pir_mode']['pir_value_reported'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['pir_range'] = "Long-range Detection";
						break;
					case 1:
						decoded_data['pir_mode']['pir_range'] = "Short-range Detection";
						break;
					default:
						decoded_data['pir_mode']['pir_range'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['pir_presence_flag'] = "Presence Detection";
						break;
					case 1:
						decoded_data['pir_mode']['pir_presence_flag'] = "Motion Detection";
						break;
					default:
						decoded_data['pir_mode']['pir_presence_flag'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 6, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['event_transmission_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['pir_mode']['event_transmission_enabled'] = "Enable";
						break;
					default:
						decoded_data['pir_mode']['event_transmission_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['transducer_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['pir_mode']['transducer_enabled'] = "Enable";
						break;
					default:
						decoded_data['pir_mode']['transducer_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x54],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('pir_holdoff')) {
					decoded_data['pir_holdoff'] = {};
				}
				decoded_data['pir_holdoff']['post_turn_on'] = decode_field(arg, 2, 15, 8, "unsigned");
				decoded_data['pir_holdoff']['post_disturbance'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x4E],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('pir_sensitivity')) {
					decoded_data['pir_sensitivity'] = {};
				}
				decoded_data['pir_sensitivity']['pir_sens_threshold'] = decode_field(arg, 3, 23, 8, "unsigned");
				decoded_data['pir_sensitivity']['pir_sens_hysteresis'] = decode_field(arg, 3, 7, 0, "unsigned");
				return 3;
			}
		},
		{
			key: [0x6A],
			fn: function(arg) { 
				decoded_data['pir_init_retries'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x3F],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_fov_object_temp'] = "Disable";
						break;
					case 1:
						decoded_data['pir_fov_object_temp'] = "Enable";
						break;
					default:
						decoded_data['pir_fov_object_temp'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x4C],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('fov_temp_thresholds')) {
					decoded_data['fov_temp_thresholds'] = {};
				}
				decoded_data['fov_temp_thresholds']['fov_object_temp_high'] = decode_field(arg, 3, 15, 8, "signed");
				decoded_data['fov_temp_thresholds']['fov_object_temp_low'] = decode_field(arg, 3, 7, 0, "signed");
				var val = decode_field(arg, 3, 23, 23, "unsigned");
				{switch (val){
					case 0:
						decoded_data['fov_temp_thresholds']['fov_object_temp_thresholds_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['fov_temp_thresholds']['fov_object_temp_thresholds_enabled'] = "Enable";
						break;
					default:
						decoded_data['fov_temp_thresholds']['fov_object_temp_thresholds_enabled'] = "Invalid";
				}}
				return 3;
			}
		},
		{
			key: [0x34],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('accelerometer')) {
					decoded_data['accelerometer'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer']['impact_threshold_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer']['impact_threshold_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer']['impact_threshold_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer']['acceleration_threshold_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer']['acceleration_threshold_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer']['acceleration_threshold_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 3, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer']['acceleration_power_mode'] = "Low power";
						break;
					case 1:
						decoded_data['accelerometer']['acceleration_power_mode'] = "Normal";
						break;
					case 2:
						decoded_data['accelerometer']['acceleration_power_mode'] = "High Resolution";
						break;
					case 3:
						decoded_data['accelerometer']['acceleration_power_mode'] = "Invalid";
						break;
					default:
						decoded_data['accelerometer']['acceleration_power_mode'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer']['xaxis_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer']['xaxis_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer']['xaxis_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer']['yaxis_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer']['yaxis_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer']['yaxis_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 6, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer']['zaxis_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer']['zaxis_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer']['zaxis_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer']['poweron'] = "Off";
						break;
					case 1:
						decoded_data['accelerometer']['poweron'] = "On";
						break;
					default:
						decoded_data['accelerometer']['poweron'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x35],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('accelerometer_sensitivityAccelerometer Sensitivity')) {
					decoded_data['accelerometer_sensitivityAccelerometer Sensitivity'] = {};
				}
				var val = decode_field(arg, 1, 2, 0, "unsigned");
				{switch (val){
					case 1:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_sample_rate'] = "1 Hz";
						break;
					case 2:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_sample_rate'] = "10 Hz";
						break;
					case 3:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_sample_rate'] = "25 Hz";
						break;
					case 4:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_sample_rate'] = "50 Hz";
						break;
					case 5:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_sample_rate'] = "100 Hz";
						break;
					case 6:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_sample_rate'] = "200 Hz";
						break;
					case 7:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_sample_rate'] = "400 Hz";
						break;
					default:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_sample_rate'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_measurement_range'] = "+/- 2 g";
						break;
					case 1:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_measurement_range'] = "+/-4 g";
						break;
					case 2:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_measurement_range'] = "+/-8 g";
						break;
					case 3:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_measurement_range'] = "+/-16 g";
						break;
					default:
						decoded_data['accelerometer_sensitivityAccelerometer Sensitivity']['accelerometer_measurement_range'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x30],
			fn: function(arg) { 
				decoded_data['impact_event_threshold'] = (decode_field(arg, 2, 15, 0, "unsigned") * 0.001).toFixed(3);
				return 2;
			}
		},
		{
			key: [0x32],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('values_to_transmit')) {
					decoded_data['values_to_transmit'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_transmit']['report_periodic_alarm_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['values_to_transmit']['report_periodic_alarm_enabled'] = "Enable";
						break;
					default:
						decoded_data['values_to_transmit']['report_periodic_alarm_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_transmit']['report_periodic_magnitude_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['values_to_transmit']['report_periodic_magnitude_enabled'] = "Enable";
						break;
					default:
						decoded_data['values_to_transmit']['report_periodic_magnitude_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_transmit']['report_periodic_vector_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['values_to_transmit']['report_periodic_vector_enabled'] = "Enable";
						break;
					default:
						decoded_data['values_to_transmit']['report_periodic_vector_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_transmit']['report_event_magnitude_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['values_to_transmit']['report_event_magnitude_enabled'] = "Enable";
						break;
					default:
						decoded_data['values_to_transmit']['report_event_magnitude_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_transmit']['report_event_vector_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['values_to_transmit']['report_event_vector_enabled'] = "Enable";
						break;
					default:
						decoded_data['values_to_transmit']['report_event_vector_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x36],
			fn: function(arg) { 
				decoded_data['impact_alarm_grace_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x37],
			fn: function(arg) { 
				decoded_data['impact_alarm_threshold_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x38],
			fn: function(arg) { 
				decoded_data['impact_alarm_threshold_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x31],
			fn: function(arg) { 
				decoded_data['acceleration_event_threshold'] = (decode_field(arg, 2, 15, 0, "unsigned") * 0.001).toFixed(3);
				return 2;
			}
		},
		{
			key: [0x33],
			fn: function(arg) { 
				decoded_data['acceleration_debounce_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x39],
			fn: function(arg) { 
				decoded_data['temp_rh_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3A],
			fn: function(arg) { 
				decoded_data['temperature_rh_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3B],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('temperature_threshold')) {
					decoded_data['temperature_threshold'] = {};
				}
				decoded_data['temperature_threshold']['temp_threshold_high'] = decode_field(arg, 2, 15, 8, "signed");
				decoded_data['temperature_threshold']['temp_threshold_low'] = decode_field(arg, 2, 7, 0, "signed");
				return 2;
			}
		},
		{
			key: [0x3C],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
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
			key: [0x3D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('rh_threshold')) {
					decoded_data['rh_threshold'] = {};
				}
				decoded_data['rh_threshold']['rh_threshold_high'] = (decode_field(arg, 2, 15, 8, "unsigned") * 0.5).toFixed(1);
				decoded_data['rh_threshold']['rh_threshold_low'] = (decode_field(arg, 2, 7, 0, "unsigned") * 0.5).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x3E],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['rh_thresholds_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['rh_thresholds_enabled'] = "Enable";
						break;
					default:
						decoded_data['rh_thresholds_enabled'] = "Invalid";
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
				if(!decoded_data.hasOwnProperty('mcu_temp_threshold')) {
					decoded_data['mcu_temp_threshold'] = {};
				}
				decoded_data['mcu_temp_threshold']['high_mcu_temp_threshold'] = decode_field(arg, 2, 15, 8, "signed");
				decoded_data['mcu_temp_threshold']['low_mcu_temp_threshold'] = decode_field(arg, 2, 7, 0, "signed");
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
			key: [0x47],
			fn: function(arg) { 
				decoded_data['light_sample_period'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x48],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('light_thresholds')) {
					decoded_data['light_thresholds'] = {};
				}
				decoded_data['light_thresholds']['threshold_light'] = decode_field(arg, 1, 5, 0, "unsigned");
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['light_thresholds']['threshold_enabled_light'] = "Disable";
						break;
					case 1:
						decoded_data['light_thresholds']['threshold_enabled_light'] = "Enable";
						break;
					default:
						decoded_data['light_thresholds']['threshold_enabled_light'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x49],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('light_values_to_transmit')) {
					decoded_data['light_values_to_transmit'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['light_values_to_transmit']['report_state_enabled_light'] = "Disable";
						break;
					case 1:
						decoded_data['light_values_to_transmit']['report_state_enabled_light'] = "Enable";
						break;
					default:
						decoded_data['light_values_to_transmit']['report_state_enabled_light'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['light_values_to_transmit']['report_intensity_enabled_light'] = "Disable";
						break;
					case 1:
						decoded_data['light_values_to_transmit']['report_intensity_enabled_light'] = "Enable";
						break;
					default:
						decoded_data['light_values_to_transmit']['report_intensity_enabled_light'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x60],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('sample_analysis_mode')) {
					decoded_data['sample_analysis_mode'] = {};
				}
				decoded_data['sample_analysis_mode']['iir_recall_factor'] = decode_field(arg, 1, 3, 0, "unsigned");
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sample_analysis_mode']['analysis_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['sample_analysis_mode']['analysis_enabled'] = "Enable";
						break;
					default:
						decoded_data['sample_analysis_mode']['analysis_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x61],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('hpf_mode')) {
					decoded_data['hpf_mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hpf_mode']['enabled_on_outputs'] = "Disable";
						break;
					case 1:
						decoded_data['hpf_mode']['enabled_on_outputs'] = "Enable";
						break;
					default:
						decoded_data['hpf_mode']['enabled_on_outputs'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hpf_mode']['enabled_on_interrupts'] = "Disable";
						break;
					case 1:
						decoded_data['hpf_mode']['enabled_on_interrupts'] = "Enable";
						break;
					default:
						decoded_data['hpf_mode']['enabled_on_interrupts'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hpf_mode']['enabled_on_sample_analysis'] = "Disable";
						break;
					case 1:
						decoded_data['hpf_mode']['enabled_on_sample_analysis'] = "Enable";
						break;
					default:
						decoded_data['hpf_mode']['enabled_on_sample_analysis'] = "Invalid";
				}}
				decoded_data['hpf_mode']['cutoff'] = decode_field(arg, 1, 5, 4, "unsigned");
				return 1;
			}
		},
		{
			key: [0x62],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('acceleration_event_thresholds')) {
					decoded_data['acceleration_event_thresholds'] = {};
				}
				decoded_data['acceleration_event_thresholds']['acceleration_event_stop_threshold'] = (decode_field(arg, 4, 31, 16, "unsigned") * 0.001).toFixed(3);
				decoded_data['acceleration_event_thresholds']['acceleration_event_report_duration_min'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x63],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ml_config')) {
					decoded_data['ml_config'] = {};
				}
				decoded_data['ml_config']['num'] = decode_field(arg, 7, 55, 48, "unsigned");
				decoded_data['ml_config']['ml1upper'] = (decode_field(arg, 7, 47, 32, "unsigned") * 0.001).toFixed(3);
				decoded_data['ml_config']['ml1lower'] = (decode_field(arg, 7, 31, 16, "unsigned") * 0.001).toFixed(3);
				decoded_data['ml_config']['ml_step'] = (decode_field(arg, 7, 15, 0, "unsigned") * 0.001).toFixed(3);
				return 7;
			}
		},
		{
			key: [0x64],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ml1_dlim_config')) {
					decoded_data['ml1_dlim_config'] = {};
				}
				decoded_data['ml1_dlim_config']['ml1_num_dims'] = decode_field(arg, 5, 39, 32, "unsigned");
				decoded_data['ml1_dlim_config']['ml1_dlim0'] = decode_field(arg, 5, 31, 16, "unsigned");
				decoded_data['ml1_dlim_config']['ml1_dlim_step'] = decode_field(arg, 5, 15, 0, "unsigned");
				return 5;
			}
		},
		{
			key: [0x65],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ml2_dlim_config')) {
					decoded_data['ml2_dlim_config'] = {};
				}
				decoded_data['ml2_dlim_config']['ml2_num_dims'] = decode_field(arg, 5, 39, 32, "unsigned");
				decoded_data['ml2_dlim_config']['ml2_dlim0'] = decode_field(arg, 5, 31, 16, "unsigned");
				decoded_data['ml2_dlim_config']['ml2_dlim_step'] = decode_field(arg, 5, 15, 0, "unsigned");
				return 5;
			}
		},
		{
			key: [0x66],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('AE1_thresholds')) {
					decoded_data['AE1_thresholds'] = {};
				}
				decoded_data['AE1_thresholds']['ae1_thresholds_enabled'] = decode_field(arg, 9, 71, 64, "unsigned");
				decoded_data['AE1_thresholds']['ae10_threshold'] = decode_field(arg, 9, 63, 48, "unsigned");
				decoded_data['AE1_thresholds']['ae11_threshold'] = decode_field(arg, 9, 47, 32, "unsigned");
				decoded_data['AE1_thresholds']['ae12_threshold '] = decode_field(arg, 9, 31, 16, "unsigned");
				decoded_data['AE1_thresholds']['ae13_threshold'] = decode_field(arg, 9, 15, 0, "unsigned");
				return 9;
			}
		},
		{
			key: [0x67],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('AE2_thresholds')) {
					decoded_data['AE2_thresholds'] = {};
				}
				decoded_data['AE2_thresholds']['ae2_thresholds_enabled'] = decode_field(arg, 9, 71, 64, "unsigned");
				decoded_data['AE2_thresholds']['ae20_threshold'] = decode_field(arg, 9, 63, 48, "unsigned");
				decoded_data['AE2_thresholds']['ae21_threshold'] = decode_field(arg, 9, 47, 32, "unsigned");
				decoded_data['AE2_thresholds']['ae22_threshold'] = decode_field(arg, 9, 31, 16, "unsigned");
				decoded_data['AE2_thresholds']['ae23_threshold'] = decode_field(arg, 9, 15, 0, "unsigned");
				return 9;
			}
		},
		{
			key: [0x68],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('accelerometer_analysis_tx')) {
					decoded_data['accelerometer_analysis_tx'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_analysis_tx']['duration_total_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer_analysis_tx']['duration_total_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer_analysis_tx']['duration_total_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_analysis_tx']['duration_min_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer_analysis_tx']['duration_min_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer_analysis_tx']['duration_min_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_analysis_tx']['duration_max_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer_analysis_tx']['duration_max_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer_analysis_tx']['duration_max_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['accelerometer_analysis_tx']['duration_sd_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['accelerometer_analysis_tx']['duration_sd_enabled'] = "Enable";
						break;
					default:
						decoded_data['accelerometer_analysis_tx']['duration_sd_enabled'] = "Invalid";
				}}
				decoded_data['accelerometer_analysis_tx']['count_enabled'] = decode_field(arg, 1, 4, 4, "unsigned");
				return 1;
			}
		},
		{
			key: [0x6C],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['cdda_event_mode'] = "Data sent on Port 10 (Legacy)";
						break;
					case 1:
						decoded_data['cdda_event_mode'] = "Data sent on Port 11/12";
						break;
					default:
						decoded_data['cdda_event_mode'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x6D],
			fn: function(arg) { 
				decoded_data['cdda_critical_event_options'] = decode_field(arg, 2, 12, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x6E],
			fn: function(arg) { 
				decoded_data['cdda_retransmission'] = decode_field(arg, 3, 23, 0, "unsigned");
				return 3;
			}
		},
		{
			key: [0x6F],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['resp_to_dl_command_format'] = "Invalid-write response format";
						break;
					case 1:
						decoded_data['resp_to_dl_command_format'] = "4-byte CRC";
						break;
					default:
						decoded_data['resp_to_dl_command_format'] = "Invalid";
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
	];
}
if (input.fPort === 10) {
	decoder = [
		{
			key: [0x00, 0xBA],
			fn: function(arg) { 
				decoded_data['battery_voltage'] = (decode_field(arg, 2, 15, 0, "unsigned") * 0.001).toFixed(3);
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
			key: [0x01, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hall_effect_state'] = "Magnet Present (Low)";
						break;
					case 255:
						decoded_data['hall_effect_state'] = "Magnet Absent (High)";
						break;
					default:
						decoded_data['hall_effect_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x08, 0x04],
			fn: function(arg) { 
				decoded_data['hall_effect_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x1E, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['extconnector_a_state'] = "Short-Circuited";
						break;
					case 255:
						decoded_data['extconnector_a_state'] = "Open-Circuited";
						break;
					default:
						decoded_data['extconnector_a_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x11, 0x02],
			fn: function(arg) { 
				decoded_data['extconnector_b_analog'] = (decode_field(arg, 2, 15, 0, "signed") * 0.001).toFixed(3);
				return 2;
			}
		},
		{
			key: [0x0E, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['extconnector_b_state'] = "Short-Circuited";
						break;
					case 255:
						decoded_data['extconnector_b_state'] = "Open-Circuited";
						break;
					default:
						decoded_data['extconnector_b_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x1F, 0x04],
			fn: function(arg) { 
				decoded_data['extconnector_a_relative_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x0F, 0x04],
			fn: function(arg) { 
				decoded_data['extconnector_b_relative_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x22, 0x04],
			fn: function(arg) { 
				decoded_data['extconnector_a_total_count'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x12, 0x04],
			fn: function(arg) { 
				decoded_data['extconnector_b_total_count'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x0D, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['extconnectors_output_state'] = "SSR non-conducting (Low)";
						break;
					case 255:
						decoded_data['extconnectors_output_state'] = "SSR conducting (High)";
						break;
					default:
						decoded_data['extconnectors_output_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x2A, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_init_state'] = "Initialization Successful";
						break;
					case 255:
						decoded_data['pir_init_state'] = "Initialization Unsuccessful";
						break;
					default:
						decoded_data['pir_init_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x0A, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_event_state'] = "No Motion/Presence Detected";
						break;
					case 255:
						decoded_data['pir_event_state'] = "Motion/Presence Detected";
						break;
					default:
						decoded_data['pir_event_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x0D, 0x04],
			fn: function(arg) { 
				decoded_data['pir_event_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x09, 0x03],
			fn: function(arg) { 
				decoded_data['pir_event_value'] = decode_field(arg, 2, 15, 0, "signed");
				return 2;
			}
		},
		{
			key: [0x06, 0x67],
			fn: function(arg) { 
				decoded_data['pir_object_temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x0C, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['impact_alarm'] = "Impact Alarm Inactive";
						break;
					case 255:
						decoded_data['impact_alarm'] = "Impact Alarm Active";
						break;
					default:
						decoded_data['impact_alarm'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x05, 0x02],
			fn: function(arg) { 
				decoded_data['acceleration_magnitude'] = (decode_field(arg, 2, 15, 0, "unsigned") * 0.001).toFixed(3);
				return 2;
			}
		},
		{
			key: [0x07, 0x71],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('acceleration')) {
					decoded_data['acceleration'] = {};
				}
				decoded_data['acceleration']['xaxis_accel'] = (decode_field(arg, 6, 47, 32, "signed") * 0.001).toFixed(3);
				decoded_data['acceleration']['yaxis_accel'] = (decode_field(arg, 6, 31, 16, "signed") * 0.001).toFixed(3);
				decoded_data['acceleration']['zaxis_accel'] = (decode_field(arg, 6, 15, 0, "signed") * 0.001).toFixed(3);
				return 6;
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
			key: [0x0B, 0x67],
			fn: function(arg) { 
				decoded_data['mcu_temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x02, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['light_detected'] = "Dark";
						break;
					case 255:
						decoded_data['light_detected'] = "Bright";
						break;
					default:
						decoded_data['light_detected'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x10, 0x02],
			fn: function(arg) { 
				decoded_data['light_intensity'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
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
						decoded_data['reset_diagnostics']['reset_reason'] = "Push-button reset";
						break;
					case 2:
						decoded_data['reset_diagnostics']['reset_reason'] = "SW reset (incl. DL request)";
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
				decoded_data['reset_diagnostics']['button_reset_count'] = decode_field(arg, 5, 7, 0, "unsigned");
				return 5;
			}
		},
		{
			key: [0x40, 0x07],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('sensor_error_diagnostics')) {
					decoded_data['sensor_error_diagnostics'] = {};
				}
				decoded_data['sensor_error_diagnostics']['barometer_failure'] = decode_field(arg, 5, 15, 8, "unsigned");
				decoded_data['sensor_error_diagnostics']['i2c_failure'] = decode_field(arg, 5, 7, 0, "unsigned");
				return 5;
			}
		},
		{
			key: [0x40, 0x08],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('sensor_assert_diagnostics')) {
					decoded_data['sensor_assert_diagnostics'] = {};
				}
				decoded_data['sensor_assert_diagnostics']['Ir_failure'] = decode_field(arg, 8, 63, 32, "unsigned");
				decoded_data['sensor_assert_diagnostics']['pc_failure'] = decode_field(arg, 8, 31, 0, "unsigned");
				return 8;
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
    }
