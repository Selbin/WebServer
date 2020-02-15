const fs = require('fs')

function bodyParser (req, res) {
  if (!req.body) return null
  if (req['Content-Type'] === 'application/json') {
    req.body = JSON.parse(req.body.toString())
  }

  if (req['Content-Type'] === 'application/x-www-form-urlencoded') {
    urlParse(req)
  }

  if (req['Content-Type'].startsWith('multipart/form-data')) {
    multipart(req)
  }
}

function urlParse (req) {
  const dataStrings = req.body.toString().split('&')
  const body = {}
  dataStrings.forEach(keyValues => {
    body[keyValues.split('=')[0].trim()] = keyValues.split('=')[1].trim()
  })
  req.body = body
}

function multipart (req) {
  const boundary = '--' + req['Content-Type'].split(';')[1].slice(10)
  const boundaryLen = Buffer.from(boundary).byteLength
  let body = req.body.slice(boundaryLen)
  while (body.indexOf(boundary) !== -1) {
    const fieldEnd = body.indexOf(boundary)
    const fieldContents = body.slice(0, fieldEnd)
    body = body.slice(fieldEnd + boundaryLen)
    const metaLen = fieldContents.indexOf('\r\n\r\n')
    const metaDatas = fieldContents.slice(0, metaLen).toString()
    const metaObj = parseMetaData(metaDatas)
    const data = fieldContents.slice(metaLen + 4)
    if (metaObj.filename) {
      fs.writeFile('./upload/' + JSON.parse(metaObj.filename), Buffer.from(data), (err) => {
        if (err) throw err
      })
    } else req.body[metaObj.name] = data
  }
}

function parseMetaData (metaDatas) {
  const keyValues = {}
  metaDatas = metaDatas.trim().split(/\r\n|;/)
  for (const metaData of metaDatas) {
    keyValues[metaData.split(/=|:/)[0].trim()] = metaData.split(/=|:/)[1].trim()
  }
  console.log(keyValues)
  return keyValues
}

module.exports = bodyParser
