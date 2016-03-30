'use strict'

const path = require('path')
const tzLookup = require('tz-lookup')
const readFile = require('fs').readFile
const Validator = require('jsonschema').Validator
const v = new Validator()
const schema = require('./event.schema.json')
const datePattern = schema.definitions.date.pattern
const timePattern = schema.definitions.time.pattern
const moment = require('moment-timezone')
const reg = new RegExp(
	'^((' +
	datePattern.substring(1, datePattern.length - 1) +
	')_' +
	timePattern.substring(1, timePattern.length - 1) +
	'_([^.]*)).json$'
)

function toISOTime(year, month, date, hour, minute, timeZone) {
	console.log(arguments)
}

module.exports = function (file, callback) {
	const parts = reg.exec(path.basename(file))	
	if (!parts) {
		return setImmediate(callback.bind(null, new Error('invalid-filename')))
	}
	readFile(file, function (err, data) {
		if (err) {
			return callback(err)
		}	
		try {
			data = JSON.parse(data)
		} catch(e) {
			return callback(e)
		} 
		console.log(v.validate(data, schema))
		var timeZone = data.online ? data.online.timeZone : tzLookup(data.location.lat, data.location.lng)
		const result = {
			contact: data.contact,
			url: data.url,
			start: moment.tz(parts[2] + ' ' + parts[11] + ':' + parts[12] + ':00', timeZone).toString(),
			slug: parts[1],
			name: data.name || parts[13],
			urlSafe: parts[13]
		}
		if (data.online) {
			result.online = {
				url: data.online.url
			}
		}
		if (data.location) {
			result.location = {
				place: data.location.place,
				lat: data.location.lat,
				lng: data.location.lng
			}
		}
		callback(null, result)
	})
}
