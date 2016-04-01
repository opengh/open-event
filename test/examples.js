'use strict'

const test = require('tap').test
const fs = require('fs')
const path = require('path')
const exampleFolder = path.join(__dirname, '..', 'example')

fs.readdirSync(exampleFolder).filter(function (path) {
  return /\.js$/.test(path)
}).forEach(function (file) {
  file = path.join(exampleFolder, file)
  test('processing ' + file, function (t) {
    const method = require(file)
    if (method.length === 1) {
      method(function (err, result) {
        t.equal(err, null)
        t.deepEqual(result, require(file + '.output'))
        t.end()
      })
    } else {
      var result = method()
      t.deepEqual(result, require(file + '.output'))
      t.end()
    }
  })
})
