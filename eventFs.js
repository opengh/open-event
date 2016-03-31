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
		let validation = v.validate(data, schema)
		if (validation.errors.length > 0) {
			let e = new Error('schema-validation-error')
			e.errors = validation.errors
			return callback(e)
		}
		let timeZone = data.online ? data.online.timeZone : tzLookup(data.location.lat, data.location.lng)
		let startDate = parts[2]
		let startTime = parts[11] + ':' + parts[12]
		let start = moment.tz(startDate + ' ' + startTime + ':00', timeZone)
		const result = {
			contact: data.contact,
			url: data.url,
			start: start.toString(),
			slug: parts[1],
			name: data.name || parts[13],
			urlSafe: parts[13],
		}
		if (data.coc) {
			result.coc = data.coc
		}
		if (data.endTime) {
			let endTime = data.endTime.replace('-', ':')
			let end = moment.tz((data.endDate || startDate) + ' ' + (endTime ? endTime : '00:00') + ':00', timeZone)
			if (end < start) {
				return callback(new Error('end-before-start'))
			}
			result.end = end.toString()
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
