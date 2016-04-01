'use strict'

const readFile = require('fs').readFile
const validate = require('./validate')

module.exports = function (file, callback) {
  try {
    validate.path(file)
  } catch (e) {
    return setImmediate(callback.bind(null, e))
  }
  readFile(file, function (err, data) {
    if (err) {
      let e = new Error('file-read-error')
      e.more = err
      return callback(e)
    }
    let result
    try {
      result = validate(file, data)
    } catch (e) {
      return callback(e)
    }
    callback(null, result)
  })
}
