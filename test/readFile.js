'use strict'

const test = require('tap').test
const readFile = require('../readFile')
const path = require('path')
const examplePath = path.join(__dirname, '..', 'example', 'files')
const brokenPath = path.join(__dirname, 'broken_files')

test('valid minimal online event', function (t) {
  const name = 'minimal-online'
  const slug = `2016-04-30_20-59_${name}`
  readFile(path.join(examplePath, `${slug}.json`), function (err, event) {
    t.equal(err, null)
    t.deepEqual(event, {
      start: 'Sat Apr 30 2016 20:59:00 GMT+0900',
      slug: slug,
      urlSafe: name,
      name: name,
      contact: 'email@example.com',
      url: 'http://some.domain',
      online: {
        url: 'http://hangout.google.com'
      }
    })
    t.end()
  })
})

test('valid minimal offine event', function (t) {
  const name = 'minimal-offline'
  const slug = `2016-03-30_20-30_${name}`
  readFile(path.join(examplePath, `${slug}.json`), function (err, event) {
    t.equal(err, null)
    t.deepEqual(event, {
      start: 'Wed Mar 30 2016 20:30:00 GMT+0900',
      slug: slug,
      urlSafe: name,
      name: name,
      contact: 'email@example.com',
      url: 'http://some.domain',
      location: {
        lat: 34.32,
        lng: 134.32,
        place: 'Venice Beach'
      }
    })
    t.end()
  })
})

test('valid maximal event', function (t) {
  const name = 'maximal'
  const slug = `2016-04-30_20-59_${name}`
  readFile(path.join(examplePath, `${slug}.json`), function (err, event) {
    t.equal(err, null)
    t.deepEqual(event, {
      start: 'Sat Apr 30 2016 20:59:00 GMT+0900',
      open: 'Sat Apr 30 2016 20:30:00 GMT+0900',
      end: 'Fri May 05 2017 13:10:00 GMT+0900',
      slug: slug,
      urlSafe: name,
      name: 'Maximal Event',
      contact: 'email@example.com',
      url: 'http://some.domain',
      coc: 'http://opengh.github.com/coc.html',
      online: {
        url: 'http://hangout.google.com'
      },
      location: {
        lat: 34.32,
        lng: 134.32,
        place: 'Venice Beach'
      }
    })
    t.end()
  })
})

test('open after start', function (t) {
  const name = 'open-after-start'
  const slug = `2016-04-30_20-59_${name}`
  readFile(path.join(brokenPath, `${slug}.json`), function (err, event) {
    t.equal(err.message, 'open-not-before-start')
    t.end()
  })
})
test('end before start', function (t) {
  const name = 'end-before-start'
  const slug = `2016-04-30_20-59_${name}`
  readFile(path.join(brokenPath, `${slug}.json`), function (err, event) {
    t.equal(err.message, 'end-before-start')
    t.end()
  })
})
test('end before start', function (t) {
  readFile('incorrect path', function (err, event) {
    t.equal(err.message, 'invalid-filename')
    t.end()
  })
})
test('not-existing-file', function (t) {
  readFile('2016-04-04_20-20_missing-file.json', function (err, event) {
    t.equal(err.message, 'file-read-error')
    t.end()
  })
})
test('unknown property', function (t) {
  readFile(path.join(brokenPath, '2016-04-04_20-29_unexpected-property.json'), function (err, event) {
    t.equal(err.message, 'schema-validation-error')
    t.end()
  })
})
test('broken json', function (t) {
  readFile(path.join(brokenPath, '2016-04-04_20-29_broken-json.json'), function (err, event) {
    t.equal(err.message, 'json-invalid-error')
    t.end()
  })
})

