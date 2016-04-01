var filePath = require('path').join(__dirname, 'files', '2016-04-30_20-59_maximal.json')
var openEvent = require('..')

module.exports = function (callback) {
  // Read an event json file from the file system, asynchronous
  openEvent.readFile(filePath, function (err, event) {
    callback(err, event)
  })
}
