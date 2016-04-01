'use strict'

const fs = require('fs')
const path = require('path')
const replace = require('markdown-replace-section')
const readme = path.join(__dirname, '..', 'Readme.md')
var content = fs.readFileSync(readme, 'utf8')

function renderSpec () {
  const spec = require('../event.schema.v1.json')
  var reqs = function (partSpec) {
    if (!partSpec.anyOf && !partSpec.required) {
      return {}
    }
    var anyOf = (partSpec.anyOf || []).concat(partSpec).map(function (partSpec) {
      return partSpec.required
    }).filter(function (required) {
      return required && true || false
    })
    var partValue = 1 / anyOf.length
    return anyOf.reduce(function (reqs, required, nr) {
      required.forEach(function (key) {
        reqs[key] = (reqs[key] || 0) + partValue
      })
      return reqs
    }, {})
  }

  var renderProperties = function (props, prefix, required) {
    return Object.keys(props).reduce(function (lines, propName) {
      var prop = props[propName]
      const exampleParts = /\s*Example:\s*(.*)$/.exec(prop.description)
      var description = prop.description
      if (prop.$ref) {
        const refParts = /^\#\/definitions\/(.*)$/.exec(prop.$ref)
        if (refParts) {
          prop = spec.definitions[refParts[1]]
        } else {
          console.log('Warning: ignoring ' + prefix + propName + ' because it is of unknown type.')
          return lines
        }
      }
      const result = {
        prop: prefix + '**' + propName + '**',
        type: prop.type,
        description: '',
        notes: '',
        example: ''
      }
      if (exampleParts) {
        result.description = description.substr(0, exampleParts.index)
        const noteParts = /\(([^\)]*)\)\s*$/.exec(exampleParts[1])
        if (noteParts) {
          result.notes = '_' + noteParts[1].trim() + '_'
          result.example = exampleParts[1].substr(0, noteParts.index)
        } else {
          result.example = exampleParts[1]
        }
        result.example = '`' + result.example + '`'
      } else {
        result.description = description
      }
      if (required[propName] > 0.999999) {
        result.prop += ' `*`'
      } else if (required[propName] > 0) {
        result.prop += ' `**`'
      }
      lines.push(result)
      if (prop.type === 'object') {
        return lines.concat(renderProperties(prop.properties, '_' + prefix + propName + '._', reqs(prop)))
      }
      return lines
    }, [])
  }

  return '| Property | Type | Description | Example | Note |\n' +
         '|----------|------|-------------|---------|------|\n' +
          renderProperties(spec.properties, '', reqs(spec)).map(function (info) {
            return '| ' + info.prop + ' | ' + info.type + ' | ' + info.description + ' | ' + info.example + ' | ' + info.notes + ' |'
          }).join('\n') +
         '\n' +
         '\n `*`: Required.' +
         '\n `**`: Conditionally Required.' +
         '\n'
}

content = replace(content, 'JSON Properties', renderSpec())
fs.writeFileSync(readme, content)
