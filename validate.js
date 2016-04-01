'use strict'

const schema = require('./event.schema.v1.json')
const datePattern = schema.definitions.date.pattern
const timePattern = schema.definitions.time.pattern
const tzLookup = require('tz-lookup')
const moment = require('moment-timezone')
const Validator = require('jsonschema').Validator
const v = new Validator()
const path = require('path')
const reg = new RegExp(
  '^((' +
  datePattern.substring(1, datePattern.length - 1) +
  ')_' +
  timePattern.substring(1, timePattern.length - 1) +
  '_([^.]+)).json$'
)

function validatePath (file) {
  const parts = reg.exec(path.basename(file))
  if (!parts) {
    throw new Error('invalid-filename')
  }
  return parts
}

module.exports = function validate (file, bufferOrString) {
  const parts = validatePath(file)
  var data = bufferOrString.toString()

  try {
    data = JSON.parse(data)
  } catch (e) {
    let error = new Error('json-invalid-error')
    error.details = e
    throw error
  }
  let validation = v.validate(data, schema)
  if (validation.errors.length > 0) {
    let e = new Error('schema-validation-error')
    e.errors = validation.errors
    throw e
  }
  const timeZone = data.online ? data.online.timeZone : tzLookup(data.location.lat, data.location.lng)
  const startDate = parts[2]
  const startTime = parts[11] + ':' + parts[12]
  const start = moment.tz(startDate + ' ' + startTime + ':00', timeZone)
  const result = {
    contact: data.contact,
    url: data.url,
    start: start.toString(),
    slug: parts[1],
    name: data.name || parts[13],
    urlSafe: parts[13]
  }
  if (data.coc) {
    result.coc = data.coc
  }
  if (data.openTime) {
    const openTime = data.openTime.replace('-', ':')
    const open = moment.tz(startDate + ' ' + openTime + ':00', timeZone)
    if (open >= start) {
      throw new Error('open-not-before-start')
    }
    result.open = open.toString()
  }
  if (data.endTime) {
    const endTime = data.endTime.replace('-', ':')
    const end = moment.tz((data.endDate || startDate) + ' ' + (endTime || '00:00') + ':00', timeZone)
    if (end < start) {
      throw new Error('end-before-start')
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
  return result
}
module.exports.path = validatePath
