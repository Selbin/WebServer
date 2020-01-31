const reqParser = require('./reqParser')
const fs = require('fs').promises
const path = require('path')

function getContentType (uri) {
  const contentType = {
    js: 'application/js',
    json: 'application/json',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    mp4: 'video/mp4',
    html: 'text/html'
  }
  const content = contentType[path.extname(uri).slice(1)]
  if (content === undefined) throw new Error('invalid content type')
  return `Content-Type: ${content}`
}
async function createResponse (reqObj) {
  if (reqObj.method === 'GET') {
    try {
      let res =
        'HTTP/1.1 200 ok\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept\r\n'
      if (reqObj.uri === '/') reqObj.uri = '/index.html'
      const body = Buffer.from(await fs.readFile('.' + reqObj.uri))
      res += `Content-Length: ${body.length}\r\n`
      res += getContentType(reqObj.uri) + '\r\n\r\n'
      res = Buffer.from(res)
      res = Buffer.concat([res, body])
      return res
    } catch (error) {
      let res = 'HTTP/1.0 400 Bad Request\r\nContent-Type: text/html\r\n'
      const body = Buffer.from(await fs.readFile('./error.html'))
      res += `Content-Length: ${body.length}\r\n\r\n`
      res = Buffer.from(res)
      res = Buffer.concat([res, body])
      return res
    }
  }
}
module.exports = { createResponse }
