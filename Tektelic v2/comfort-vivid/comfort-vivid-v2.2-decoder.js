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

if (input.fPort === 100) {
	decoder = [
		{
			key: [0x00],
			fn: function(arg) { 
				decoded_data['device_eui'] = decode_field(arg, 8, 63, 0, "hexstring");
				return 8;
			}
		},
		{
			key: [0x01],
			fn: function(arg) { 
				decoded_data['app_eui'] = decode_field(arg, 8, 63, 0, "hexstring");
				return 8;
			}
		},
		{
			key: [0x02],
			fn: function(arg) { 
				decoded_data['app_key'] = decode_field(arg, 16, 127, 0, "hexstring");
				return 16;
			}
		},
		{
			key: [0x03],
			fn: function(arg) { 
				decoded_data['device_address'] = decode_field(arg, 4, 31, 0, "hexstring");
				return 4;
			}
		},
		{
			key: [0x04],
			fn: function(arg) { 
				decoded_data['network_session_key'] = decode_field(arg, 16, 127, 0, "hexstring");
				return 16;
			}
		},
		{
			key: [0x05],
			fn: function(arg) { 
				decoded_data['app_session_key'] = decode_field(arg, 16, 127, 0, "hexstring");
				return 16;
			}
		},
		{
			key: [0x10],
			fn: function(arg) { 
				var val = decode_field(arg, 2, 15, 15, "unsigned");
				{switch (val){
					case 0:
						decoded_data['join_mode'] = "ABP";
						break;
					case 1:
						decoded_data['join_mode'] = "OTAA";
						break;
					default:
						decoded_data['join_mode'] = "Invalid";
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
				decoded_data['loramac_dr_tx']['tx_dr_number'] = decode_field(arg, 2, 11, 8, "unsigned");
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
				decoded_data['loramac_rx2']['rx2_dr_number'] = decode_field(arg, 5, 7, 0, "unsigned");
				return 5;
			}
		},
		{
			key: [0x19],
			fn: function(arg) { 
				decoded_data['loramac_net_id_msb'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x1A],
			fn: function(arg) { 
				decoded_data['loramac_net_id_lsb'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x20],
			fn: function(arg) { 
				decoded_data['core'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x21],
			fn: function(arg) { 
				decoded_data['per_battery'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x22],
			fn: function(arg) { 
				decoded_data['per_temperature'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x23],
			fn: function(arg) { 
				decoded_data['per_relative_humidity'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x24],
			fn: function(arg) { 
				decoded_data['per_digital_input'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x25],
			fn: function(arg) { 
				decoded_data['per_light'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x26],
			fn: function(arg) { 
				decoded_data['per_acceleration'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x27],
			fn: function(arg) { 
				decoded_data['per_mcu_temperature'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x28],
			fn: function(arg) { 
				decoded_data['per_pir'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x29],
			fn: function(arg) { 
				decoded_data['per_external_connector'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('mode')) {
					decoded_data['mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode']['read_rising_edge'] = "Disable";
						break;
					case 1:
						decoded_data['mode']['read_rising_edge'] = "Enable";
						break;
					default:
						decoded_data['mode']['read_rising_edge'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode']['read_falling_edge'] = "Disable";
						break;
					case 1:
						decoded_data['mode']['read_falling_edge'] = "Enable";
						break;
					default:
						decoded_data['mode']['read_falling_edge'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x2B],
			fn: function(arg) { 
				decoded_data['reed_switch_count_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2C],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('reed_values_to_transmit')) {
					decoded_data['reed_values_to_transmit'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['reed_values_to_transmit']['report_state'] = "Off";
						break;
					case 1:
						decoded_data['reed_values_to_transmit']['report_state'] = "On";
						break;
					default:
						decoded_data['reed_values_to_transmit']['report_state'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['reed_values_to_transmit']['report_count'] = "Off";
						break;
					case 1:
						decoded_data['reed_values_to_transmit']['report_count'] = "On";
						break;
					default:
						decoded_data['reed_values_to_transmit']['report_count'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x2D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('external_mode')) {
					decoded_data['external_mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_mode']['rising_edge'] = "Off";
						break;
					case 1:
						decoded_data['external_mode']['rising_edge'] = "On";
						break;
					default:
						decoded_data['external_mode']['rising_edge'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_mode']['falling_edge'] = "Off";
						break;
					case 1:
						decoded_data['external_mode']['falling_edge'] = "On";
						break;
					default:
						decoded_data['external_mode']['falling_edge'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_mode']['analog'] = "Digital";
						break;
					case 1:
						decoded_data['external_mode']['analog'] = "Analog";
						break;
					default:
						decoded_data['external_mode']['analog'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x2E],
			fn: function(arg) { 
				decoded_data['external_connector_count_thresh'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2F],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('external_values_to_transmit')) {
					decoded_data['external_values_to_transmit'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_values_to_transmit']['state'] = "Off";
						break;
					case 1:
						decoded_data['external_values_to_transmit']['state'] = "On";
						break;
					default:
						decoded_data['external_values_to_transmit']['state'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_values_to_transmit']['report_count_enabled'] = "Off";
						break;
					case 1:
						decoded_data['external_values_to_transmit']['report_count_enabled'] = "On";
						break;
					default:
						decoded_data['external_values_to_transmit']['report_count_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x30],
			fn: function(arg) { 
				decoded_data['impact_alarm_threshold'] = (decode_field(arg, 2, 15, 0, "unsigned") * 0.001).toFixed(3);
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
			key: [0x32],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('values_to_transmit')) {
					decoded_data['values_to_transmit'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_transmit']['report_periodic_alarm_enabled'] = "Off";
						break;
					case 1:
						decoded_data['values_to_transmit']['report_periodic_alarm_enabled'] = "On";
						break;
					default:
						decoded_data['values_to_transmit']['report_periodic_alarm_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_transmit']['report_periodic_magnitude_enabled'] = "Off";
						break;
					case 1:
						decoded_data['values_to_transmit']['report_periodic_magnitude_enabled'] = "On";
						break;
					default:
						decoded_data['values_to_transmit']['report_periodic_magnitude_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_transmit']['report_periodic_vector_enabled'] = "Off";
						break;
					case 1:
						decoded_data['values_to_transmit']['report_periodic_vector_enabled'] = "On";
						break;
					default:
						decoded_data['values_to_transmit']['report_periodic_vector_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_transmit']['report_event_magnitude_enabled'] = "Off";
						break;
					case 1:
						decoded_data['values_to_transmit']['report_event_magnitude_enabled'] = "On";
						break;
					default:
						decoded_data['values_to_transmit']['report_event_magnitude_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['values_to_transmit']['report_event_vector_enabled'] = "Off";
						break;
					case 1:
						decoded_data['values_to_transmit']['report_event_vector_enabled'] = "On";
						break;
					default:
						decoded_data['values_to_transmit']['report_event_vector_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x33],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('event_debounce_time')) {
					decoded_data['event_debounce_time'] = {};
				}
				decoded_data['event_debounce_time']['impact_grace_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x34],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('acceleration_mode')) {
					decoded_data['acceleration_mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_mode']['impact_alarm_threshold_enable'] = "Disable";
						break;
					case 1:
						decoded_data['acceleration_mode']['impact_alarm_threshold_enable'] = "Enable";
						break;
					default:
						decoded_data['acceleration_mode']['impact_alarm_threshold_enable'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_mode']['event_threshold_enable'] = "Disable";
						break;
					case 1:
						decoded_data['acceleration_mode']['event_threshold_enable'] = "Enable";
						break;
					default:
						decoded_data['acceleration_mode']['event_threshold_enable'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_mode']['x_axis'] = "Disable";
						break;
					case 1:
						decoded_data['acceleration_mode']['x_axis'] = "Enable";
						break;
					default:
						decoded_data['acceleration_mode']['x_axis'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_mode']['y_axis'] = "Disable";
						break;
					case 1:
						decoded_data['acceleration_mode']['y_axis'] = "Enable";
						break;
					default:
						decoded_data['acceleration_mode']['y_axis'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 6, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_mode']['z_axis'] = "Disable";
						break;
					case 1:
						decoded_data['acceleration_mode']['z_axis'] = "Enable";
						break;
					default:
						decoded_data['acceleration_mode']['z_axis'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['acceleration_mode']['power'] = "Off";
						break;
					case 1:
						decoded_data['acceleration_mode']['power'] = "On";
						break;
					default:
						decoded_data['acceleration_mode']['power'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x35],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('sensitivity')) {
					decoded_data['sensitivity'] = {};
				}
				var val = decode_field(arg, 1, 2, 0, "unsigned");
				{switch (val){
					case 1:
						decoded_data['sensitivity']['sample_rate'] = "1 Hz";
						break;
					case 2:
						decoded_data['sensitivity']['sample_rate'] = "10 Hz";
						break;
					case 3:
						decoded_data['sensitivity']['sample_rate'] = "25 Hz";
						break;
					case 4:
						decoded_data['sensitivity']['sample_rate'] = "50 Hz";
						break;
					case 5:
						decoded_data['sensitivity']['sample_rate'] = "100 Hz";
						break;
					case 6:
						decoded_data['sensitivity']['sample_rate'] = "200 Hz";
						break;
					case 7:
						decoded_data['sensitivity']['sample_rate'] = "400 Hz";
						break;
					default:
						decoded_data['sensitivity']['sample_rate'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sensitivity']['measurement_range'] = "±2 g";
						break;
					case 1:
						decoded_data['sensitivity']['measurement_range'] = "±4 g";
						break;
					case 2:
						decoded_data['sensitivity']['measurement_range'] = "±8 g";
						break;
					case 3:
						decoded_data['sensitivity']['measurement_range'] = "±16 g";
						break;
					default:
						decoded_data['sensitivity']['measurement_range'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x36],
			fn: function(arg) { 
				decoded_data['alarm_grace_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x37],
			fn: function(arg) { 
				decoded_data['alarm_event_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x38],
			fn: function(arg) { 
				decoded_data['alarm_threshold_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x39],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ambient_temp_rh_sample')) {
					decoded_data['ambient_temp_rh_sample'] = {};
				}
				decoded_data['ambient_temp_rh_sample']['temprh_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ambient_temp_rh_sample')) {
					decoded_data['ambient_temp_rh_sample'] = {};
				}
				decoded_data['ambient_temp_rh_sample']['temprh_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3B],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('temperature_threshold')) {
					decoded_data['temperature_threshold'] = {};
				}
				decoded_data['temperature_threshold']['temp_high_threshold'] = decode_field(arg, 2, 15, 8, "signed");
				decoded_data['temperature_threshold']['temp_low_threshold'] = decode_field(arg, 2, 7, 0, "signed");
				return 2;
			}
		},
		{
			key: [0x3C],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('temperature_threshold')) {
					decoded_data['temperature_threshold'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['temperature_threshold']['temp_threshold_enable'] = "Disable";
						break;
					case 1:
						decoded_data['temperature_threshold']['temp_threshold_enable'] = "Enable";
						break;
					default:
						decoded_data['temperature_threshold']['temp_threshold_enable'] = "Invalid";
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
				decoded_data['rh_threshold']['rh_high'] = decode_field(arg, 2, 15, 8, "unsigned");
				decoded_data['rh_threshold']['rh_low'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x3E],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('rh_threshold')) {
					decoded_data['rh_threshold'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['rh_threshold']['rh_threshold_enable'] = "Disable";
						break;
					case 1:
						decoded_data['rh_threshold']['rh_threshold_enable'] = "Enable";
						break;
					default:
						decoded_data['rh_threshold']['rh_threshold_enable'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x40],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('mcu_temp_sample')) {
					decoded_data['mcu_temp_sample'] = {};
				}
				decoded_data['mcu_temp_sample']['mcu_temp_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x41],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('mcu_temp_sample')) {
					decoded_data['mcu_temp_sample'] = {};
				}
				decoded_data['mcu_temp_sample']['mcu_temp_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x42],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('mcu_temp_threshold')) {
					decoded_data['mcu_temp_threshold'] = {};
				}
				decoded_data['mcu_temp_threshold']['mcu_temp_high'] = decode_field(arg, 2, 15, 8, "signed");
				decoded_data['mcu_temp_threshold']['mcu_temp_low'] = decode_field(arg, 2, 7, 0, "signed");
				return 2;
			}
		},
		{
			key: [0x43],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('mcu_temp_threshold')) {
					decoded_data['mcu_temp_threshold'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mcu_temp_threshold']['mcu_temp_threshold_enable'] = "Disabled";
						break;
					case 1:
						decoded_data['mcu_temp_threshold']['mcu_temp_threshold_enable'] = "Enabled";
						break;
					default:
						decoded_data['mcu_temp_threshold']['mcu_temp_threshold_enable'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x44],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('analog_in_sample_period')) {
					decoded_data['analog_in_sample_period'] = {};
				}
				decoded_data['analog_in_sample_period']['analog_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x45],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('analog_in_sample_period')) {
					decoded_data['analog_in_sample_period'] = {};
				}
				decoded_data['analog_in_sample_period']['analog_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x46],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('analog_threshold')) {
					decoded_data['analog_threshold'] = {};
				}
				decoded_data['analog_threshold']['analog_high'] = (decode_field(arg, 4, 31, 16, "unsigned") * 0.001).toFixed(3);
				decoded_data['analog_threshold']['analog_low'] = (decode_field(arg, 4, 15, 0, "unsigned") * 0.001).toFixed(3);
				return 4;
			}
		},
		{
			key: [0x4A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('analog_threshold')) {
					decoded_data['analog_threshold'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['analog_threshold']['analog_threshold_enable'] = "Disabled";
						break;
					case 1:
						decoded_data['analog_threshold']['analog_threshold_enable'] = "Enabled";
						break;
					default:
						decoded_data['analog_threshold']['analog_threshold_enable'] = "Invalid";
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
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['light_thresholds']['light_threshold_enable'] = "Disabled";
						break;
					case 1:
						decoded_data['light_thresholds']['light_threshold_enable'] = "Enabled";
						break;
					default:
						decoded_data['light_thresholds']['light_threshold_enable'] = "Invalid";
				}}
				decoded_data['light_thresholds']['light_threshold_control'] = decode_field(arg, 1, 5, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x49],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('light_values_to_transmit')) {
					decoded_data['light_values_to_transmit'] = {};
				}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['light_values_to_transmit']['light_tx_intensity_reported'] = "Disabled";
						break;
					case 1:
						decoded_data['light_values_to_transmit']['light_tx_intensity_reported'] = "Enabled";
						break;
					default:
						decoded_data['light_values_to_transmit']['light_tx_intensity_reported'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['light_values_to_transmit']['light_state'] = "Disabled";
						break;
					case 1:
						decoded_data['light_values_to_transmit']['light_state'] = "Enabled";
						break;
					default:
						decoded_data['light_values_to_transmit']['light_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x50],
			fn: function(arg) { 
				decoded_data['grace_period'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x51],
			fn: function(arg) { 
				decoded_data['count_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x52],
			fn: function(arg) { 
				decoded_data['period_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x53],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('pir_mode')) {
					decoded_data['pir_mode'] = {};
				}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['pir_enable'] = "Disabled";
						break;
					case 1:
						decoded_data['pir_mode']['pir_enable'] = "Enabled";
						break;
					default:
						decoded_data['pir_mode']['pir_enable'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 6, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['pir_event_tx'] = "Disabled";
						break;
					case 1:
						decoded_data['pir_mode']['pir_event_tx'] = "Enabled";
						break;
					default:
						decoded_data['pir_mode']['pir_event_tx'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['pir_motion_state'] = "Disabled";
						break;
					case 1:
						decoded_data['pir_mode']['pir_motion_state'] = "Enabled";
						break;
					default:
						decoded_data['pir_mode']['pir_motion_state'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['pir_mode']['pir_motion_count'] = "Disabled";
						break;
					case 1:
						decoded_data['pir_mode']['pir_motion_count'] = "Enabled";
						break;
					default:
						decoded_data['pir_mode']['pir_motion_count'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x54],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('hold_off_int')) {
					decoded_data['hold_off_int'] = {};
				}
				decoded_data['hold_off_int']['post_turnon_hold_off'] = decode_field(arg, 2, 15, 8, "unsigned");
				decoded_data['hold_off_int']['post_disturbance_hold_off'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x5A],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 2, 0, "unsigned");
				{switch (val){
					case 1:
						decoded_data['sample_period'] = "16 sec";
						break;
					case 2:
						decoded_data['sample_period'] = "32 sec";
						break;
					case 3:
						decoded_data['sample_period'] = "64 sec";
						break;
					case 4:
						decoded_data['sample_period'] = "128 sec";
						break;
					default:
						decoded_data['sample_period'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x5B],
			fn: function(arg) { 
				decoded_data['threshold'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x5C],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sensor_enable'] = "Disabled";
						break;
					case 1:
						decoded_data['sensor_enable'] = "Enabled";
						break;
					default:
						decoded_data['sensor_enable'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x5D],
			fn: function(arg) { 
				decoded_data['dry_calibration'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x60],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('sample_analysis_mode')) {
					decoded_data['sample_analysis_mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sample_analysis_mode']['analysis_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['sample_analysis_mode']['analysis_enabled'] = "Enabled";
						break;
					default:
						decoded_data['sample_analysis_mode']['analysis_enabled'] = "Invalid";
				}}
				decoded_data['sample_analysis_mode']['cic_enabled'] = decode_field(arg, 1, 1, 1, "unsigned");
				return 1;
			}
		},
		{
			key: [0x61],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('hpf_config')) {
					decoded_data['hpf_config'] = {};
				}
				decoded_data['hpf_config']['cutoff_freq'] = decode_field(arg, 1, 5, 4, "unsigned");
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hpf_config']['hpf_on_sample'] = "Disabled";
						break;
					case 1:
						decoded_data['hpf_config']['hpf_on_sample'] = "Enabled";
						break;
					default:
						decoded_data['hpf_config']['hpf_on_sample'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hpf_config']['hpf_on_accel_interrupts'] = "Disabled";
						break;
					case 1:
						decoded_data['hpf_config']['hpf_on_accel_interrupts'] = "Enabled";
						break;
					default:
						decoded_data['hpf_config']['hpf_on_accel_interrupts'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['hpf_config']['hpf_on_accel_output'] = "Disabled";
						break;
					case 1:
						decoded_data['hpf_config']['hpf_on_accel_output'] = "Enabled";
						break;
					default:
						decoded_data['hpf_config']['hpf_on_accel_output'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x62],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('cic_filter_config')) {
					decoded_data['cic_filter_config'] = {};
				}
				decoded_data['cic_filter_config']['d'] = decode_field(arg, 3, 23, 16, "unsigned");
				decoded_data['cic_filter_config']['r'] = decode_field(arg, 3, 15, 8, "unsigned");
				decoded_data['cic_filter_config']['m'] = decode_field(arg, 3, 7, 0, "unsigned");
				return 3;
			}
		},
		{
			key: [0x63],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ml_config')) {
					decoded_data['ml_config'] = {};
				}
				decoded_data['ml_config']['nonzero_MLs'] = decode_field(arg, 7, 55, 48, "unsigned");
				decoded_data['ml_config']['ml_upper_limit'] = decode_field(arg, 7, 47, 32, "unsigned");
				decoded_data['ml_config']['ml_lower_limit'] = decode_field(arg, 7, 31, 16, "unsigned");
				decoded_data['ml_config']['ml_step'] = decode_field(arg, 7, 15, 0, "unsigned");
				return 7;
			}
		},
		{
			key: [0x64],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ml1_dlim_config')) {
					decoded_data['ml1_dlim_config'] = {};
				}
				var val = decode_field(arg, 14, 111, 104, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ml1_dlim_config']['num_dlims'] = "0";
						break;
					case 1:
						decoded_data['ml1_dlim_config']['num_dlims'] = "1";
						break;
					case 2:
						decoded_data['ml1_dlim_config']['num_dlims'] = "2";
						break;
					case 3:
						decoded_data['ml1_dlim_config']['num_dlims'] = "3";
						break;
					default:
						decoded_data['ml1_dlim_config']['num_dlims'] = "Invalid";
				}}
				decoded_data['ml1_dlim_config']['dlim0_0'] = decode_field(arg, 14, 103, 88, "unsigned");
				decoded_data['ml1_dlim_config']['dlim_step_0'] = decode_field(arg, 14, 87, 72, "unsigned");
				var val = decode_field(arg, 14, 71, 64, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ml1_dlim_config']['threshold_enable_0'] = "Disabled";
						break;
					case 1:
						decoded_data['ml1_dlim_config']['threshold_enable_0'] = "Enabled on Duration Total";
						break;
					case 2:
						decoded_data['ml1_dlim_config']['threshold_enable_0'] = "Enabled on Count";
						break;
					default:
						decoded_data['ml1_dlim_config']['threshold_enable_0'] = "Invalid";
				}}
				decoded_data['ml1_dlim_config']['AE10_threshold'] = decode_field(arg, 14, 63, 48, "unsigned");
				decoded_data['ml1_dlim_config']['AE11_threshold'] = decode_field(arg, 14, 47, 32, "unsigned");
				decoded_data['ml1_dlim_config']['AE12_threshold'] = decode_field(arg, 14, 31, 16, "unsigned");
				decoded_data['ml1_dlim_config']['AE13_threshold'] = decode_field(arg, 14, 15, 0, "unsigned");
				return 14;
			}
		},
		{
			key: [0x65],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ml2_dlim_config')) {
					decoded_data['ml2_dlim_config'] = {};
				}
				var val = decode_field(arg, 14, 111, 104, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ml2_dlim_config']['num_of_dlims'] = "0";
						break;
					case 1:
						decoded_data['ml2_dlim_config']['num_of_dlims'] = "1";
						break;
					case 2:
						decoded_data['ml2_dlim_config']['num_of_dlims'] = "2";
						break;
					case 3:
						decoded_data['ml2_dlim_config']['num_of_dlims'] = "3";
						break;
					default:
						decoded_data['ml2_dlim_config']['num_of_dlims'] = "Invalid";
				}}
				decoded_data['ml2_dlim_config']['dlim0_1'] = decode_field(arg, 14, 103, 88, "unsigned");
				decoded_data['ml2_dlim_config']['dlim_step_1'] = decode_field(arg, 14, 87, 72, "unsigned");
				var val = decode_field(arg, 14, 71, 64, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ml2_dlim_config']['threshold_enabled_1'] = "Disabled";
						break;
					case 1:
						decoded_data['ml2_dlim_config']['threshold_enabled_1'] = "Enabled on Duration Total";
						break;
					case 2:
						decoded_data['ml2_dlim_config']['threshold_enabled_1'] = "Enabled on Count";
						break;
					default:
						decoded_data['ml2_dlim_config']['threshold_enabled_1'] = "Invalid";
				}}
				decoded_data['ml2_dlim_config']['AE20_threshold'] = decode_field(arg, 14, 63, 48, "unsigned");
				decoded_data['ml2_dlim_config']['AE21_threshold'] = decode_field(arg, 14, 47, 32, "unsigned");
				decoded_data['ml2_dlim_config']['AE22_threshold'] = decode_field(arg, 14, 31, 16, "unsigned");
				decoded_data['ml2_dlim_config']['AE23_threshold'] = decode_field(arg, 14, 15, 0, "unsigned");
				return 14;
			}
		},
		{
			key: [0x68],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('sample_analysis')) {
					decoded_data['sample_analysis'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sample_analysis']['AE_duration_total_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['sample_analysis']['AE_duration_total_enabled'] = "Enabled";
						break;
					default:
						decoded_data['sample_analysis']['AE_duration_total_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sample_analysis']['AE_duration_min_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['sample_analysis']['AE_duration_min_enabled'] = "Enabled";
						break;
					default:
						decoded_data['sample_analysis']['AE_duration_min_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sample_analysis']['AE_duration_max_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['sample_analysis']['AE_duration_max_enabled'] = "Enabled";
						break;
					default:
						decoded_data['sample_analysis']['AE_duration_max_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sample_analysis']['AE_duration_range_Enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['sample_analysis']['AE_duration_range_Enabled'] = "Enabled";
						break;
					default:
						decoded_data['sample_analysis']['AE_duration_range_Enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sample_analysis']['AE_duration_mean_Enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['sample_analysis']['AE_duration_mean_Enabled'] = "Enabled";
						break;
					default:
						decoded_data['sample_analysis']['AE_duration_mean_Enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sample_analysis']['AE_duration_median_Enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['sample_analysis']['AE_duration_median_Enabled'] = "Enabled";
						break;
					default:
						decoded_data['sample_analysis']['AE_duration_median_Enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 6, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sample_analysis']['AE_duration_SD_Enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['sample_analysis']['AE_duration_SD_Enabled'] = "Enabled";
						break;
					default:
						decoded_data['sample_analysis']['AE_duration_SD_Enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['sample_analysis']['AE_duration_count_Enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['sample_analysis']['AE_duration_count_Enabled'] = "Enabled";
						break;
					default:
						decoded_data['sample_analysis']['AE_duration_count_Enabled'] = "Invalid";
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
			key: [0x01, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['reed_state'] = "Off";
						break;
					case 255:
						decoded_data['reed_state'] = "On";
						break;
					default:
						decoded_data['reed_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x08, 0x04],
			fn: function(arg) { 
				decoded_data['reed_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x0C, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['impact_alarm'] = "Off";
						break;
					case 255:
						decoded_data['impact_alarm'] = "On";
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
				decoded_data['acceleration']['x'] = (decode_field(arg, 6, 47, 32, "signed") * 0.001).toFixed(3);
				decoded_data['acceleration']['y'] = (decode_field(arg, 6, 31, 16, "signed") * 0.001).toFixed(3);
				decoded_data['acceleration']['z'] = (decode_field(arg, 6, 15, 0, "signed") * 0.001).toFixed(3);
				return 6;
			}
		},
		{
			key: [0x0E, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['external_connector_state'] = "Low(short-circuit)";
						break;
					case 255:
						decoded_data['external_connector_state'] = "High(open-circuit)";
						break;
					default:
						decoded_data['external_connector_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x0F, 0x04],
			fn: function(arg) { 
				decoded_data['external_connector_counter'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x11, 0x02],
			fn: function(arg) { 
				decoded_data['external_connector_analog_mv'] = (decode_field(arg, 2, 15, 0, "signed") * 0.001).toFixed(3);
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
		{
			key: [0x0A, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['motion_event_state'] = "None";
						break;
					case 255:
						decoded_data['motion_event_state'] = "Detected";
						break;
					default:
						decoded_data['motion_event_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x0D, 0x04],
			fn: function(arg) { 
				decoded_data['motion_event_count'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x09, 0x00],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['moisture'] = "Dry";
						break;
					case 255:
						decoded_data['moisture'] = "Wet";
						break;
					default:
						decoded_data['moisture'] = "Invalid";
				}}
				return 1;
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
		"tektelicMetadata": input.tektelicMetadata
    };

    return output;
