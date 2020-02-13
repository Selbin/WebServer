const fs = require('fs')

function bodyParser (req, res) {
  if (!req.body) return null
  if (req['Content-Type'] === 'application/json') {
    req.body = JSON.parse(req.body)
  }

  if (req['Content-Type'] === 'application/x-www-form-urlencoded') {
    urlParse(req)
  }

  if (req['Content-Type'].startsWith('multipart/form-data')) {
    multipart(req)
  }
}

function urlParse (req) {
  const dataStrings = req.body.split('&')
  const body = {}
  dataStrings.forEach(keyValues => {
    body[keyValues.split('=')[0].trim()] = keyValues.split('=')[1].trim()
  })
  req.body = body
}

function multipart (req) {
  const boundary = '--' + req['Content-Type'].split(';')[1].slice(10)
  const fieldContents = req.body.split(boundary).slice(1, -1)
  req.body = {}
  for (const field of fieldContents) {
    const [metaDatas, data] = field.trim().split('\r\n\r\n')
    const metaObj = parseMetaData(metaDatas)
    if (metaObj.filename) {
      fs.writeFile('./upload/' + JSON.parse(metaObj.filename), data, (err) => {
        if (err) throw err
      })
    } else req.body[metaObj.name] = data
  }
}

function parseMetaData (metaDatas) {
  const keyValues = {}
  metaDatas = metaDatas.split(/\r\n|;/)
  for (const metaData of metaDatas) {
    keyValues[metaData.split(/=|:/)[0].trim()] = metaData.split(/=|:/)[1].trim()
  }
  return keyValues
}

module.exports = bodyParser
