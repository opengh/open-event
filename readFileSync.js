'use strict'

const readFileSync = require('fs').readFileSync
const validate = require('./validate')

module.exports = function (file) {
  validate.path(file)
  try {
    return validate(file, readFileSync(file))
  } catch (err) {
    let e = new Error('file-read-error')
    e.more = err
    throw e
  }
}
