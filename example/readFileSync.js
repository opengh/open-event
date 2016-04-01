var filePath = require('path').join(__dirname, 'files', '2016-04-30_20-59_maximal.json')
var openEvent = require('..')

module.exports = function () {
  try {
    // Read an event json file from the file system, synchronous
    var event = openEvent.readFileSync(filePath)
    return event
  } catch (e) {
    throw e
  }
}
