'use strict'

function getCachedDate (cache, date) {
  if (!cache[date]) {
    cache[date] = new Date(date).getTime()
  }
  return cache[date]
}

function getCachedCenter (cache, open, start, end) {
  if (end) {
    const startTime = getCachedDate(cache, open || start)
    return startTime + (getCachedDate(cache, end) - startTime) * 0.5
  }
  if (open) {
    const openTime = getCachedDate(cache, open)
    return openTime + (getCachedDate(cache, start) - openTime) * 0.5
  }
  return getCachedDate(cache, start)
}

exports.byStart = function (order) {
  const cache = {}
  const bigger = order !== -1 ? 1 : -1
  const smaller = order !== -1 ? -1 : 1
  return function (eventA, eventB) {
    var timeA = getCachedDate(cache, eventA.start)
    var timeB = getCachedDate(cache, eventB.start)
    if (timeA > timeB) return bigger
    if (timeB > timeA) return smaller
    return 0
  }
}
exports.byOpen = function (order) {
  const cache = {}
  const bigger = order !== -1 ? 1 : -1
  const smaller = order !== -1 ? -1 : 1
  return function (eventA, eventB) {
    var timeA = getCachedDate(cache, eventA.open || eventA.start)
    var timeB = getCachedDate(cache, eventB.open || eventB.start)
    if (timeA > timeB) return bigger
    if (timeB > timeA) return smaller
    return 0
  }
}
exports.byEnd = function (order) {
  const cache = {}
  const bigger = order !== -1 ? 1 : -1
  const smaller = order !== -1 ? -1 : 1
  return function (eventA, eventB) {
    var timeA = getCachedDate(cache, eventA.end || eventA.start)
    var timeB = getCachedDate(cache, eventB.end || eventB.start)
    if (timeA > timeB) return bigger
    if (timeB > timeA) return smaller
    return 0
  }
}
exports.byCenter = function (order) {
  const cache = {}
  const bigger = order !== -1 ? 1 : -1
  const smaller = order !== -1 ? -1 : 1
  return function (eventA, eventB) {
    var timeA = getCachedCenter(cache, eventA.open, eventA.start, eventA.end)
    var timeB = getCachedCenter(cache, eventA.open, eventB.start, eventB.end)
    if (timeA > timeB) return bigger
    if (timeB > timeA) return smaller
    return 0
  }
}
