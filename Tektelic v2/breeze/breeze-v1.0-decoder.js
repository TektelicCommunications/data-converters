//DCG: v1.0.0

var bytes = input.bytes;
var port = input.fPort;
var decoded_data = {};
var decoder = [];
bytes = convertToUint8Array(bytes);
decoded_data['raw'] = toHexString(bytes).toUpperCase();
decoded_data['port'] = port;

if (port === 101) {
	decoder = [
		{
			key: [0x10],
			fn: function(arg) { 
				var val = decode_field(arg, 2, 15, 15, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_join_mode_error'] = "ABP";
						break;
					case 1:
						decoded_data['loramac_join_mode_error'] = "OTAA";
						break;
					default:
						decoded_data['loramac_join_mode_error'] = "Invalid";
				}}
				return 2;
			}
		},
		{
			key: [0x11],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('loramac_opts_error')) {
					decoded_data['loramac_opts_error'] = {};
				}
				var val = decode_field(arg, 2, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts_error']['loramac_ul_type_error'] = "Unconfirmed";
						break;
					case 1:
						decoded_data['loramac_opts_error']['loramac_ul_type_error'] = "Confirmed";
						break;
					default:
						decoded_data['loramac_opts_error']['loramac_ul_type_error'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts_error']['loramac_sync_word_error'] = "Private";
						break;
					case 1:
						decoded_data['loramac_opts_error']['loramac_sync_word_error'] = "Public";
						break;
					default:
						decoded_data['loramac_opts_error']['loramac_sync_word_error'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts_error']['loramac_duty_cycle_error'] = "Disable";
						break;
					case 1:
						decoded_data['loramac_opts_error']['loramac_duty_cycle_error'] = "Enable";
						break;
					default:
						decoded_data['loramac_opts_error']['loramac_duty_cycle_error'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts_error']['loramac_adr_error'] = "Disable";
						break;
					case 1:
						decoded_data['loramac_opts_error']['loramac_adr_error'] = "Enable";
						break;
					default:
						decoded_data['loramac_opts_error']['loramac_adr_error'] = "Invalid";
				}}
				return 2;
			}
		},
		{
			key: [0x12],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('loramac_dr_tx_error')) {
					decoded_data['loramac_dr_tx_error'] = {};
				}
				decoded_data['loramac_dr_tx_error']['loramac_default_tx_pwr_error'] = decode_field(arg, 2, 3, 0, "unsigned");
				decoded_data['loramac_dr_tx_error']['loramac_default_dr_error'] = decode_field(arg, 2, 11, 8, "unsigned");
				return 2;
			}
		},
		{
			key: [0x13],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('loramac_rx2_error')) {
					decoded_data['loramac_rx2_error'] = {};
				}
				decoded_data['loramac_rx2_error']['loramac_rx2_dr_error'] = decode_field(arg, 5, 7, 0, "unsigned");
				decoded_data['loramac_rx2_error']['loramac_rx2_freq_error'] = decode_field(arg, 5, 39, 8, "unsigned");
				return 5;
			}
		},
		{
			key: [0x19],
			fn: function(arg) { 
				decoded_data['loramac_net_id_msb_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x1A],
			fn: function(arg) { 
				decoded_data['loramac_net_id_lsb_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x20],
			fn: function(arg) { 
				decoded_data['seconds_per_core_tick_error'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x21],
			fn: function(arg) { 
				decoded_data['ticks_battery_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x22],
			fn: function(arg) { 
				decoded_data['ticks_temp_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x23],
			fn: function(arg) { 
				decoded_data['ticks_rh_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x26],
			fn: function(arg) { 
				decoded_data['ticks_co2_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x27],
			fn: function(arg) { 
				decoded_data['ticks_pressure_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x28],
			fn: function(arg) { 
				decoded_data['ticks_motion_pir_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x38],
			fn: function(arg) { 
				decoded_data['pressure_iir_recall_factor_error'] = decode_field(arg, 1, 4, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x39],
			fn: function(arg) { 
				decoded_data['temp_rh_sample_period_idle_error'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3A],
			fn: function(arg) { 
				decoded_data['temp_rh_sample_period_active_error'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3B],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('temp_thresholds_error')) {
					decoded_data['temp_thresholds_error'] = {};
				}
				decoded_data['temp_thresholds_error']['temp_threshold_low_error'] = (decode_field(arg, 2, 7, 0, "signed")).toFixed(1);
				decoded_data['temp_thresholds_error']['temp_threshold_high_error'] = (decode_field(arg, 2, 15, 8, "signed")).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x3C],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['temp_thresholds_enabled_error'] = "Disable";
						break;
					case 1:
						decoded_data['temp_thresholds_enabled_error'] = "Enable";
						break;
					default:
						decoded_data['temp_thresholds_enabled_error'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x3D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('rh_threshold_error')) {
					decoded_data['rh_threshold_error'] = {};
				}
				decoded_data['rh_threshold_error']['rh_threshold_low_error'] = (decode_field(arg, 2, 7, 0, "unsigned")).toFixed(1);
				decoded_data['rh_threshold_error']['rh_threshold_high_error'] = (decode_field(arg, 2, 15, 8, "unsigned")).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x3E],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['rh_thresholds_enabled_error'] = "Disable";
						break;
					case 1:
						decoded_data['rh_thresholds_enabled_error'] = "Enable";
						break;
					default:
						decoded_data['rh_thresholds_enabled_error'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x40],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('battery_report_options_error')) {
					decoded_data['battery_report_options_error'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_report_options_error']['battery_voltage_reported_error'] = "Not Reported";
						break;
					case 1:
						decoded_data['battery_report_options_error']['battery_voltage_reported_error'] = "Reported";
						break;
					default:
						decoded_data['battery_report_options_error']['battery_voltage_reported_error'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_report_options_error']['battery_capacity_sensor_reported_error'] = "Not Reported";
						break;
					case 1:
						decoded_data['battery_report_options_error']['battery_capacity_sensor_reported_error'] = "Reported";
						break;
					default:
						decoded_data['battery_report_options_error']['battery_capacity_sensor_reported_error'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_report_options_error']['battery_capacity_display_reported_error'] = "Not Reported";
						break;
					case 1:
						decoded_data['battery_report_options_error']['battery_capacity_display_reported_error'] = "Reported";
						break;
					default:
						decoded_data['battery_report_options_error']['battery_capacity_display_reported_error'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x50],
			fn: function(arg) { 
				decoded_data['pir_grace_period_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x51],
			fn: function(arg) { 
				decoded_data['pir_threshold_count_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x52],
			fn: function(arg) { 
				decoded_data['pir_threshold_period_error'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x53],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('mode_error')) {
					decoded_data['mode_error'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode_error']['pir_motion_count_reported_error'] = "Disabled";
						break;
					case 1:
						decoded_data['mode_error']['pir_motion_count_reported_error'] = "Enabled";
						break;
					default:
						decoded_data['mode_error']['pir_motion_count_reported_error'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode_error']['pir_motion_state_reported_error'] = "Disabled";
						break;
					case 1:
						decoded_data['mode_error']['pir_motion_state_reported_error'] = "Enabled";
						break;
					default:
						decoded_data['mode_error']['pir_motion_state_reported_error'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 6, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode_error']['pir_event_based_reporting_enabled_error'] = "Disabled";
						break;
					case 1:
						decoded_data['mode_error']['pir_event_based_reporting_enabled_error'] = "Enabled";
						break;
					default:
						decoded_data['mode_error']['pir_event_based_reporting_enabled_error'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode_error']['sensor_enable_error'] = "Disabled";
						break;
					case 1:
						decoded_data['mode_error']['sensor_enable_error'] = "Enabled";
						break;
					default:
						decoded_data['mode_error']['sensor_enable_error'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x54],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('hold_off_intervals_error')) {
					decoded_data['hold_off_intervals_error'] = {};
				}
				decoded_data['hold_off_intervals_error']['post_turn_on_hold_off_error'] = decode_field(arg, 2, 15, 8, "unsigned");
				decoded_data['hold_off_intervals_error']['post_disturbance_hold_off_error'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x66],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['drm_enabled_error'] = "Disabled";
						break;
					case 1:
						decoded_data['drm_enabled_error'] = "Enabled";
						break;
					default:
						decoded_data['drm_enabled_error'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x67],
			fn: function(arg) { 
				decoded_data['drm_request_update_period_error'] = decode_field(arg, 1, 7, 4, "unsigned");
				return 1;
			}
		},
		{
			key: [0x68],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('active_hours_error')) {
					decoded_data['active_hours_error'] = {};
				}
				decoded_data['active_hours_error']['drm_active_start_hr_error'] = decode_field(arg, 3, 23, 16, "unsigned");
				decoded_data['active_hours_error']['drm_active_end_hr_error'] = decode_field(arg, 3, 15, 8, "unsigned");
				var val = decode_field(arg, 3, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours_error']['drm_active_on_sunday_error'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours_error']['drm_active_on_sunday_error'] = "Enabled";
						break;
					default:
						decoded_data['active_hours_error']['drm_active_on_sunday_error'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours_error']['drm_active_on_monday_error'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours_error']['drm_active_on_monday_error'] = "Enabled";
						break;
					default:
						decoded_data['active_hours_error']['drm_active_on_monday_error'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours_error']['drm_active_on_tuesday_error'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours_error']['drm_active_on_tuesday_error'] = "Enabled";
						break;
					default:
						decoded_data['active_hours_error']['drm_active_on_tuesday_error'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours_error']['drm_active_on_wednesday_error'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours_error']['drm_active_on_wednesday_error'] = "Enabled";
						break;
					default:
						decoded_data['active_hours_error']['drm_active_on_wednesday_error'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours_error']['drm_active_on_thursday_error'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours_error']['drm_active_on_thursday_error'] = "Enabled";
						break;
					default:
						decoded_data['active_hours_error']['drm_active_on_thursday_error'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours_error']['drm_active_on_friday_error'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours_error']['drm_active_on_friday_error'] = "Enabled";
						break;
					default:
						decoded_data['active_hours_error']['drm_active_on_friday_error'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 6, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours_error']['drm_active_on_saturday_error'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours_error']['drm_active_on_saturday_error'] = "Enabled";
						break;
					default:
						decoded_data['active_hours_error']['drm_active_on_saturday_error'] = "Invalid";
				}}
				return 3;
			}
		},
		{
			key: [0x69],
			fn: function(arg) { 
				decoded_data['seconds_per_core_tick_inactive_error'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x6A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('co2_sampling_parameters_error')) {
					decoded_data['co2_sampling_parameters_error'] = {};
				}
				decoded_data['co2_sampling_parameters_error']['co2_sample_period_inactive_error'] = decode_field(arg, 3, 23, 8, "unsigned");
				decoded_data['co2_sampling_parameters_error']['co2_num_subsample_inactive_error'] = decode_field(arg, 3, 7, 0, "unsigned");
				return 3;
			}
		},
		{
			key: [0x6F],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['response_format_error'] = "Invalid write response format";
						break;
					case 1:
						decoded_data['response_format_error'] = "4-byte CRC";
						break;
					default:
						decoded_data['response_format_error'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x70],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('write_to_flash_error')) {
					decoded_data['write_to_flash_error'] = {};
				}
				var val = decode_field(arg, 2, 13, 13, "unsigned");
				{switch (val){
					case 0:
						decoded_data['write_to_flash_error']['app_configuration_error'] = "De-asserted";
						break;
					case 1:
						decoded_data['write_to_flash_error']['app_configuration_error'] = "Asserted";
						break;
					default:
						decoded_data['write_to_flash_error']['app_configuration_error'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 14, 14, "unsigned");
				{switch (val){
					case 0:
						decoded_data['write_to_flash_error']['lora_configuration_error'] = "De-asserted";
						break;
					case 1:
						decoded_data['write_to_flash_error']['lora_configuration_error'] = "Asserted";
						break;
					default:
						decoded_data['write_to_flash_error']['lora_configuration_error'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['write_to_flash_error']['restart_sensor_error'] = "De-asserted";
						break;
					case 1:
						decoded_data['write_to_flash_error']['restart_sensor_error'] = "Asserted";
						break;
					default:
						decoded_data['write_to_flash_error']['restart_sensor_error'] = "Invalid";
				}}
				return 2;
			}
		},
		{
			key: [0x71],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('metadata_error')) {
					decoded_data['metadata_error'] = {};
				}
				decoded_data['metadata_error']['app_major_version_error'] = decode_field(arg, 7, 55, 48, "unsigned");
				decoded_data['metadata_error']['app_minor_version_error'] = decode_field(arg, 7, 47, 40, "unsigned");
				decoded_data['metadata_error']['app_revision_error'] = decode_field(arg, 7, 39, 32, "unsigned");
				decoded_data['metadata_error']['loramac_major_version_error'] = decode_field(arg, 7, 31, 24, "unsigned");
				decoded_data['metadata_error']['loramac_minor_version_error'] = decode_field(arg, 7, 23, 16, "unsigned");
				decoded_data['metadata_error']['loramac_revision_error'] = decode_field(arg, 7, 15, 8, "unsigned");
				var val = decode_field(arg, 7, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['metadata_error']['region_error'] = "EU868";
						break;
					case 1:
						decoded_data['metadata_error']['region_error'] = "US916";
						break;
					case 2:
						decoded_data['metadata_error']['region_error'] = "AS923";
						break;
					case 3:
						decoded_data['metadata_error']['region_error'] = "AU915";
						break;
					case 4:
						decoded_data['metadata_error']['region_error'] = "IN865";
						break;
					case 5:
						decoded_data['metadata_error']['region_error'] = "CN470";
						break;
					case 6:
						decoded_data['metadata_error']['region_error'] = "KR920";
						break;
					case 7:
						decoded_data['metadata_error']['region_error'] = "RU864";
						break;
					case 8:
						decoded_data['metadata_error']['region_error'] = "DN915";
						break;
					default:
						decoded_data['metadata_error']['region_error'] = "Invalid";
				}}
				return 7;
			}
		},
		{
			key: [0x72],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 10:
						decoded_data['configuration_factory_reset_error'] = "App Config";
						break;
					case 176:
						decoded_data['configuration_factory_reset_error'] = "LoRa Config";
						break;
					case 186:
						decoded_data['configuration_factory_reset_error'] = "App & LoRa Config";
						break;
					default:
						decoded_data['configuration_factory_reset_error'] = "Invalid";
				}}
				return 1;
			}
		},
	];
}
if (port === 100) {
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
						decoded_data['loramac_opts']['loramac_ul_type'] = "Unconfirmed";
						break;
					case 1:
						decoded_data['loramac_opts']['loramac_ul_type'] = "Confirmed";
						break;
					default:
						decoded_data['loramac_opts']['loramac_ul_type'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts']['loramac_sync_word'] = "Private";
						break;
					case 1:
						decoded_data['loramac_opts']['loramac_sync_word'] = "Public";
						break;
					default:
						decoded_data['loramac_opts']['loramac_sync_word'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts']['loramac_duty_cycle'] = "Disable";
						break;
					case 1:
						decoded_data['loramac_opts']['loramac_duty_cycle'] = "Enable";
						break;
					default:
						decoded_data['loramac_opts']['loramac_duty_cycle'] = "Invalid";
				}}
				var val = decode_field(arg, 2, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['loramac_opts']['loramac_adr'] = "Disable";
						break;
					case 1:
						decoded_data['loramac_opts']['loramac_adr'] = "Enable";
						break;
					default:
						decoded_data['loramac_opts']['loramac_adr'] = "Invalid";
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
				decoded_data['loramac_dr_tx']['loramac_default_tx_pwr'] = decode_field(arg, 2, 3, 0, "unsigned");
				decoded_data['loramac_dr_tx']['loramac_default_dr'] = decode_field(arg, 2, 11, 8, "unsigned");
				return 2;
			}
		},
		{
			key: [0x13],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('loramac_rx2')) {
					decoded_data['loramac_rx2'] = {};
				}
				decoded_data['loramac_rx2']['loramac_rx2_dr'] = decode_field(arg, 5, 7, 0, "unsigned");
				decoded_data['loramac_rx2']['loramac_rx2_freq'] = decode_field(arg, 5, 39, 8, "unsigned");
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
				decoded_data['seconds_per_core_tick'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x21],
			fn: function(arg) { 
				decoded_data['ticks_battery'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x22],
			fn: function(arg) { 
				decoded_data['ticks_temp'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x23],
			fn: function(arg) { 
				decoded_data['ticks_rh'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x26],
			fn: function(arg) { 
				decoded_data['ticks_co2'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x27],
			fn: function(arg) { 
				decoded_data['ticks_pressure'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x28],
			fn: function(arg) { 
				decoded_data['ticks_motion_pir'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2A],
			fn: function(arg) { 
				decoded_data['ble_display_whitelisting_enabled'] = decode_field(arg, 1, 0, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x2B],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 7, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ble_display_language'] = "English";
						break;
					case 1:
						decoded_data['ble_display_language'] = "French";
						break;
					default:
						decoded_data['ble_display_language'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x30],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('sampling_parameters')) {
					decoded_data['sampling_parameters'] = {};
				}
				decoded_data['sampling_parameters']['co2_sample_period'] = decode_field(arg, 3, 23, 8, "unsigned");
				decoded_data['sampling_parameters']['co2_num_subsamples'] = decode_field(arg, 3, 7, 0, "unsigned");
				return 3;
			}
		},
		{
			key: [0x31],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('threshold_control')) {
					decoded_data['threshold_control'] = {};
				}
				decoded_data['threshold_control']['co2_threshold_level'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x32],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('iir_filter_control')) {
					decoded_data['iir_filter_control'] = {};
				}
				var val = decode_field(arg, 1, 3, 0, "unsigned");
				{switch (val){
					case 1:
						decoded_data['iir_filter_control']['co2_static_iir_recall_factor'] = "1";
						break;
					case 2:
						decoded_data['iir_filter_control']['co2_static_iir_recall_factor'] = "2";
						break;
					case 3:
						decoded_data['iir_filter_control']['co2_static_iir_recall_factor'] = "3";
						break;
					case 4:
						decoded_data['iir_filter_control']['co2_static_iir_recall_factor'] = "4";
						break;
					case 5:
						decoded_data['iir_filter_control']['co2_static_iir_recall_factor'] = "5";
						break;
					case 6:
						decoded_data['iir_filter_control']['co2_static_iir_recall_factor'] = "6";
						break;
					case 7:
						decoded_data['iir_filter_control']['co2_static_iir_recall_factor'] = "7";
						break;
					case 8:
						decoded_data['iir_filter_control']['co2_static_iir_recall_factor'] = "8";
						break;
					case 9:
						decoded_data['iir_filter_control']['co2_static_iir_recall_factor'] = "9";
						break;
					default:
						decoded_data['iir_filter_control']['co2_static_iir_recall_factor'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['iir_filter_control']['co2_dynamic_iir_enabled'] = "Disable";
						break;
					case 1:
						decoded_data['iir_filter_control']['co2_dynamic_iir_enabled'] = "Enable";
						break;
					default:
						decoded_data['iir_filter_control']['co2_dynamic_iir_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x33],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('calibration_control')) {
					decoded_data['calibration_control'] = {};
				}
				var val = decode_field(arg, 4, 31, 24, "unsigned");
				{switch (val){
					case 0:
						decoded_data['calibration_control']['co2_calibration_type'] = "ABC Calibration";
						break;
					case 1:
						decoded_data['calibration_control']['co2_calibration_type'] = "Target Calibration";
						break;
					case 2:
						decoded_data['calibration_control']['co2_calibration_type'] = "Background Calibration";
						break;
					case 3:
						decoded_data['calibration_control']['co2_calibration_type'] = "Zero Calibration";
						break;
					case 255:
						decoded_data['calibration_control']['co2_calibration_type'] = "No Calibration";
						break;
					default:
						decoded_data['calibration_control']['co2_calibration_type'] = "Invalid";
				}}
				decoded_data['calibration_control']['co2_calibration_period'] = decode_field(arg, 4, 23, 16, "unsigned");
				decoded_data['calibration_control']['co2_calibration_target'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x34],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('report_options')) {
					decoded_data['report_options'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['report_options']['co2_raw_reported'] = "Disable";
						break;
					case 1:
						decoded_data['report_options']['co2_raw_reported'] = "Enable";
						break;
					default:
						decoded_data['report_options']['co2_raw_reported'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['report_options']['co2_pressure_compensated_reported'] = "Disable";
						break;
					case 1:
						decoded_data['report_options']['co2_pressure_compensated_reported'] = "Enable";
						break;
					default:
						decoded_data['report_options']['co2_pressure_compensated_reported'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x38],
			fn: function(arg) { 
				decoded_data['pressure_iir_recall_factor'] = decode_field(arg, 1, 4, 0, "unsigned");
				return 1;
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
				decoded_data['temp_rh_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3B],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('temp_thresholds')) {
					decoded_data['temp_thresholds'] = {};
				}
				decoded_data['temp_thresholds']['temp_threshold_low'] = (decode_field(arg, 2, 7, 0, "signed")).toFixed(1);
				decoded_data['temp_thresholds']['temp_threshold_high'] = (decode_field(arg, 2, 15, 8, "signed")).toFixed(1);
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
				decoded_data['rh_threshold']['rh_threshold_low'] = (decode_field(arg, 2, 7, 0, "unsigned")).toFixed(1);
				decoded_data['rh_threshold']['rh_threshold_high'] = (decode_field(arg, 2, 15, 8, "unsigned")).toFixed(1);
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
				if(!decoded_data.hasOwnProperty('battery_report_options')) {
					decoded_data['battery_report_options'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_report_options']['battery_voltage_reported'] = "Not Reported";
						break;
					case 1:
						decoded_data['battery_report_options']['battery_voltage_reported'] = "Reported";
						break;
					default:
						decoded_data['battery_report_options']['battery_voltage_reported'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_report_options']['battery_capacity_sensor_reported'] = "Not Reported";
						break;
					case 1:
						decoded_data['battery_report_options']['battery_capacity_sensor_reported'] = "Reported";
						break;
					default:
						decoded_data['battery_report_options']['battery_capacity_sensor_reported'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['battery_report_options']['battery_capacity_display_reported'] = "Not Reported";
						break;
					case 1:
						decoded_data['battery_report_options']['battery_capacity_display_reported'] = "Reported";
						break;
					default:
						decoded_data['battery_report_options']['battery_capacity_display_reported'] = "Invalid";
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
				decoded_data['pir_threshold_count'] = decode_field(arg, 2, 15, 0, "unsigned");
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
				if(!decoded_data.hasOwnProperty('mode')) {
					decoded_data['mode'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode']['pir_motion_count_reported'] = "Disabled";
						break;
					case 1:
						decoded_data['mode']['pir_motion_count_reported'] = "Enabled";
						break;
					default:
						decoded_data['mode']['pir_motion_count_reported'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode']['pir_motion_state_reported'] = "Disabled";
						break;
					case 1:
						decoded_data['mode']['pir_motion_state_reported'] = "Enabled";
						break;
					default:
						decoded_data['mode']['pir_motion_state_reported'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 6, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode']['pir_event_based_reporting_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['mode']['pir_event_based_reporting_enabled'] = "Enabled";
						break;
					default:
						decoded_data['mode']['pir_event_based_reporting_enabled'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['mode']['sensor_enable'] = "Disabled";
						break;
					case 1:
						decoded_data['mode']['sensor_enable'] = "Enabled";
						break;
					default:
						decoded_data['mode']['sensor_enable'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x54],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('hold_off_intervals')) {
					decoded_data['hold_off_intervals'] = {};
				}
				decoded_data['hold_off_intervals']['post_turn_on_hold_off'] = decode_field(arg, 2, 15, 8, "unsigned");
				decoded_data['hold_off_intervals']['post_disturbance_hold_off'] = decode_field(arg, 2, 7, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x66],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['drm_enabled'] = "Disabled";
						break;
					case 1:
						decoded_data['drm_enabled'] = "Enabled";
						break;
					default:
						decoded_data['drm_enabled'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x67],
			fn: function(arg) { 
				decoded_data['drm_request_update_period'] = decode_field(arg, 1, 7, 4, "unsigned");
				return 1;
			}
		},
		{
			key: [0x68],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('active_hours')) {
					decoded_data['active_hours'] = {};
				}
				decoded_data['active_hours']['drm_active_start_hr'] = decode_field(arg, 3, 23, 16, "unsigned");
				decoded_data['active_hours']['drm_active_end_hr'] = decode_field(arg, 3, 15, 8, "unsigned");
				var val = decode_field(arg, 3, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours']['drm_active_on_sunday'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours']['drm_active_on_sunday'] = "Enabled";
						break;
					default:
						decoded_data['active_hours']['drm_active_on_sunday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours']['drm_active_on_monday'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours']['drm_active_on_monday'] = "Enabled";
						break;
					default:
						decoded_data['active_hours']['drm_active_on_monday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 2, 2, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours']['drm_active_on_tuesday'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours']['drm_active_on_tuesday'] = "Enabled";
						break;
					default:
						decoded_data['active_hours']['drm_active_on_tuesday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 3, 3, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours']['drm_active_on_wednesday'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours']['drm_active_on_wednesday'] = "Enabled";
						break;
					default:
						decoded_data['active_hours']['drm_active_on_wednesday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 4, 4, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours']['drm_active_on_thursday'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours']['drm_active_on_thursday'] = "Enabled";
						break;
					default:
						decoded_data['active_hours']['drm_active_on_thursday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 5, 5, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours']['drm_active_on_friday'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours']['drm_active_on_friday'] = "Enabled";
						break;
					default:
						decoded_data['active_hours']['drm_active_on_friday'] = "Invalid";
				}}
				var val = decode_field(arg, 3, 6, 6, "unsigned");
				{switch (val){
					case 0:
						decoded_data['active_hours']['drm_active_on_saturday'] = "Disabled";
						break;
					case 1:
						decoded_data['active_hours']['drm_active_on_saturday'] = "Enabled";
						break;
					default:
						decoded_data['active_hours']['drm_active_on_saturday'] = "Invalid";
				}}
				return 3;
			}
		},
		{
			key: [0x69],
			fn: function(arg) { 
				decoded_data['seconds_per_core_tick_inactive'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x6A],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('co2_sampling_parameters')) {
					decoded_data['co2_sampling_parameters'] = {};
				}
				decoded_data['co2_sampling_parameters']['co2_sample_period_inactive'] = decode_field(arg, 3, 23, 8, "unsigned");
				decoded_data['co2_sampling_parameters']['co2_num_subsample_inactive'] = decode_field(arg, 3, 7, 0, "unsigned");
				return 3;
			}
		},
		{
			key: [0x6F],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('format_options')) {
					decoded_data['format_options'] = {};
				}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['format_options']['response_format'] = "Invalid write response format";
						break;
					case 1:
						decoded_data['format_options']['response_format'] = "4-byte CRC";
						break;
					default:
						decoded_data['format_options']['response_format'] = "Invalid";
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
if (port === 10) {
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
				decoded_data['rem_batt_capacity_sensor'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x11, 0xD3],
			fn: function(arg) { 
				decoded_data['rem_batt_capacity_display'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x0B, 0xE4],
			fn: function(arg) { 
				decoded_data['co2_pressure_compensated'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x0E, 0xE4],
			fn: function(arg) { 
				decoded_data['co2_raw'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x0C, 0x73],
			fn: function(arg) { 
				decoded_data['barometric_pressure'] = (decode_field(arg, 2, 15, 0, "unsigned") * 0.1).toFixed(1);
				return 2;
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
			key: [0x03, 0x67],
			fn: function(arg) { 
				decoded_data['temperature'] = (decode_field(arg, 2, 15, 0, "signed") * 0.1).toFixed(1);
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
	];
}
if (port === 20) {
	decoder = [
		{
			key: [0xD7, 0x00],
			fn: function(arg) { 
				decoded_data['initial_time_rqst_id'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0xD7, 0x01],
			fn: function(arg) { 
				decoded_data['existing_time_rqst_id'] = decode_field(arg, 1, 7, 0, "unsigned");
				return 1;
			}
		},
		{
			key: [0x85],
			fn: function(arg) { 
				decoded_data['sensor_local_timestamp'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0xD7],
			fn: function(arg) { 
				decoded_data['local_timestamp'] = decode_field(arg, 5, 31, 0, "unsigned");
				decoded_data['local_timestamp_rqst_id'] = decode_field(arg, 5, 39, 32, "hexstring");
				return 5;
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
				decoded_data['error'] = "Unable to decode header " + toHexString(item.key).toUpperCase();
				return decoded_data;
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

	function trunc(v){
		v = +v;
		if (!isFinite(v)) return v;
		return (v - v % 1)   ||   (v < 0 ? -0 : v === 0 ? v : 0);
	}

	// Extracts bits from a byte array
	function extract_bytes(chunk, startBit, endBit) {
		var totalBits = startBit - endBit + 1;
		var totalBytes = totalBits % 8 === 0 ? to_uint(totalBits / 8) : to_uint(totalBits / 8) + 1;
		var bitOffset = endBit % 8;
		var arr = new Array(totalBytes);
		for (var byte = totalBytes-1; byte >= 0; byte--) {
			var chunkIndex = byte + (chunk.length - 1 - trunc(startBit / 8));
			var lo = chunk[chunkIndex] >> bitOffset;
			var hi = 0;
			if (byte !== 0) {
				var hi_bitmask = (1 << bitOffset) - 1
				var bits_to_take_from_hi = 8 - bitOffset
				hi = (chunk[chunkIndex - 1] & (hi_bitmask << bits_to_take_from_hi));
			} else {
				lo = lo & ((1 << (totalBits % 8 ? totalBits % 8 : 8)) - 1);
			}
			arr[byte] = hi | lo;
		}
		return arr;
	}

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