'use strict'

const test = require('tap').test
const eventFs = require('../readFile')
const path = require('path')
const examplePath = path.join(__dirname, '..', 'example', 'files')

test('valid minimal online event', function (t) {
  const name = 'minimal-online'
  const slug = `2016-04-30_20-59_${name}`
  eventFs(path.join(examplePath, `${slug}.json`), function (err, event) {
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
  eventFs(path.join(examplePath, `${slug}.json`), function (err, event) {
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
  eventFs(path.join(examplePath, `${slug}.json`), function (err, event) {
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
