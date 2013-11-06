/**
 * Module dependencies
 */
var http = require('request'),
	util = require('sails/util'),
	log = require('./logger');


/**
 * Fetch and parse JSON data from Shipyard
 *
 * @api private
 */
module.exports = {
	login: function (options, cb) {
		return _fetch({
			url: options.baseURL + '/yarr/login',
			method: 'put',
			json: options.params
		}, cb);
	},
	getApps: function (options, cb) {
		return _fetch({
			url: options.baseURL + '/yarr/apps',
			method: 'get',
			headers: {
				'x-auth-yarr': options.secret
			}
		}, cb);
	}
};






function _fetch (options, cb) {

	http(options,
	function gotResponse (err, resp, body) {
		if (err || !body) {
			log.error();
			log.error('Error communicating with Shipyard!');
			log.error('Please make sure you are connected to the internet.');
			log.error();
			return cb(err, body);
		}

		if (resp.statusCode < 200 || resp.statusCode > 300) {
			log.error('Shipyard responded with an error:');
			log.error('Status: ' + resp.statusCode);
			return cb(body);
		}

		// If response is a string, it must be JSON (or there's a problem)
		// Let's make it into an object.
		if (typeof body === 'string') {
			try {
				body = JSON.parse(body);
			}
			catch (e) {
				log.error('Error parsing JSON response from Shipyard ::','\n',body,'\n\n');
				return cb(e);
			}
		}

		// Successfully parsed response from Shipyard
		return cb(null, body);
	});
}