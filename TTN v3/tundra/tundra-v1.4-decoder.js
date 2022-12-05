//DCG: v1.0.0

function decodeUplink(input) {

var bytes = input.bytes;
var port = input.fPort;
var decoded_data = {};
var decoder = [];
bytes = convertToUint8Array(bytes);
decoded_data['raw'] = toHexString(bytes).toUpperCase();
decoded_data['port'] = port;

if (port === 10) {
	decoder = [
		{
			key: [0x00, 0xFF],
			fn: function(arg) { 
				decoded_data['battery'] = (decode_field(arg, 2, 15, 0, "signed") * 0.01).toFixed(2);
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
					case 255:
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
				var val = decode_field(arg, 2, 7, 7, "unsigned");
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
				decoded_data['per_ambient_temp'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x23],
			fn: function(arg) { 
				decoded_data['per_ambient_humidity'] = decode_field(arg, 2, 15, 0, "unsigned");
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
				decoded_data['per_ext_probe'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2D],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('probe_varaint')) {
					decoded_data['probe_varaint'] = {};
				}
				var val = decode_field(arg, 1, 7, 7, "unsigned");
				{switch (val){
					case 0:
						decoded_data['probe_varaint']['input_mode'] = "Digital";
						break;
					case 1:
						decoded_data['probe_varaint']['input_mode'] = "Analog";
						break;
					default:
						decoded_data['probe_varaint']['input_mode'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['probe_varaint']['falling_edge'] = "Disable";
						break;
					case 1:
						decoded_data['probe_varaint']['falling_edge'] = "Enable";
						break;
					default:
						decoded_data['probe_varaint']['falling_edge'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['probe_varaint']['rising_edge'] = "Disable";
						break;
					case 1:
						decoded_data['probe_varaint']['rising_edge'] = "Enable";
						break;
					default:
						decoded_data['probe_varaint']['rising_edge'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x2E],
			fn: function(arg) { 
				decoded_data['count_threshold'] = decode_field(arg, 2, 15, 0, "unsigned");
				return 2;
			}
		},
		{
			key: [0x2F],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('value_to_tx')) {
					decoded_data['value_to_tx'] = {};
				}
				var val = decode_field(arg, 1, 1, 1, "unsigned");
				{switch (val){
					case 0:
						decoded_data['value_to_tx']['digital_input_count'] = "Disable";
						break;
					case 1:
						decoded_data['value_to_tx']['digital_input_count'] = "Enable";
						break;
					default:
						decoded_data['value_to_tx']['digital_input_count'] = "Invalid";
				}}
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['value_to_tx']['digital_input_state'] = "Disable";
						break;
					case 1:
						decoded_data['value_to_tx']['digital_input_state'] = "Enable";
						break;
					default:
						decoded_data['value_to_tx']['digital_input_state'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x39],
			fn: function(arg) { 
				decoded_data['sample_period_idle_temp'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3A],
			fn: function(arg) { 
				decoded_data['sample_period_active_temp'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x3B],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('temperature_threshold')) {
					decoded_data['temperature_threshold'] = {};
				}
				decoded_data['temperature_threshold']['low_temp'] = (decode_field(arg, 2, 7, 0, "signed")).toFixed(1);
				decoded_data['temperature_threshold']['high_temp'] = (decode_field(arg, 2, 15, 8, "signed")).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x3C],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['temperature_threshold_enable'] = "Disable";
						break;
					case 1:
						decoded_data['temperature_threshold_enable'] = "Enable";
						break;
					default:
						decoded_data['temperature_threshold_enable'] = "Invalid";
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
				decoded_data['rh_threshold']['low_humidity'] = (decode_field(arg, 2, 7, 0, "unsigned")).toFixed(1);
				decoded_data['rh_threshold']['high_humidity'] = (decode_field(arg, 2, 15, 8, "unsigned")).toFixed(1);
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
				decoded_data['sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x41],
			fn: function(arg) { 
				decoded_data['sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x42],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('threshold')) {
					decoded_data['threshold'] = {};
				}
				decoded_data['threshold']['high_mcu'] = (decode_field(arg, 2, 7, 0, "signed")).toFixed(1);
				decoded_data['threshold']['low_mc'] = (decode_field(arg, 2, 15, 8, "signed")).toFixed(1);
				return 2;
			}
		},
		{
			key: [0x43],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['threshold_enable'] = "Disable";
						break;
					case 1:
						decoded_data['threshold_enable'] = "Enable";
						break;
					default:
						decoded_data['threshold_enable'] = "Invalid";
				}}
				return 1;
			}
		},
		{
			key: [0x44],
			fn: function(arg) { 
				decoded_data['ext_thermistor_sample_period_idle'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x45],
			fn: function(arg) { 
				decoded_data['ext_thermistor_sample_period_active'] = decode_field(arg, 4, 31, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x46],
			fn: function(arg) { 
				if(!decoded_data.hasOwnProperty('ext_thermistor')) {
					decoded_data['ext_thermistor'] = {};
				}
				decoded_data['ext_thermistor']['ext_thermistor_high_threshold'] = decode_field(arg, 4, 31, 16, "unsigned");
				decoded_data['ext_thermistor']['ext_thermistor_low_threshold'] = decode_field(arg, 4, 15, 0, "unsigned");
				return 4;
			}
		},
		{
			key: [0x4A],
			fn: function(arg) { 
				var val = decode_field(arg, 1, 0, 0, "unsigned");
				{switch (val){
					case 0:
						decoded_data['ext_thermistor_threshold_enable'] = "Disable";
						break;
					case 1:
						decoded_data['ext_thermistor_threshold_enable'] = "Enable";
						break;
					default:
						decoded_data['ext_thermistor_threshold_enable'] = "Invalid";
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
  return {
    data: decoded_data,
    warnings: [],
    errors: []
  };
}