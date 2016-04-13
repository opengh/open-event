var file = require('path').join(__dirname, 'files', '2016-04-30_20-59_maximal.json')
var buffer = require('fs').readFileSync(file)
var openEvent = require('..')

module.exports = function () {
  try {
    // Validate a given event file
    var validationResult = openEvent.validate(file, buffer)
    return validationResult
  } catch (e) {
    throw e
  }
}
