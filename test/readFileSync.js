'use strict'

const test = require('tap').test
const readFileSync = require('../readFileSync')
const path = require('path')
const examplePath = path.join(__dirname, '..', 'example', 'files')
// const brokenPath = path.join(__dirname, 'broken_files')

test('valid minimal online event', function (t) {
  const name = 'minimal-online'
  const slug = `2016-04-30_20-59_${name}`
  const event = readFileSync(path.join(examplePath, `${slug}.json`))
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
test('not-existing-file', function (t) {
  try {
    readFileSync('2016-04-04_20-20_missing-file.json')
  } catch (e) {
    t.equal(e.message, 'file-read-error')
    t.end()
    return
  }
  t.fail('no error thrown')
})
