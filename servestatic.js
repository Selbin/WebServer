const fs = require('fs').promises
const getContentType = require('./getContentType')

module.exports = path =>
  async function serveStatic (reqObj, response) {
    if (reqObj.method === 'GET') {
      try {
        if (!reqObj.uri.includes(path)) return null
        if (reqObj.uri === '/') reqObj.uri = '/index.html'
        const body = Buffer.from(await fs.readFile('.' + reqObj.uri))
        const res = Buffer.from(
          `HTTP/1.1 200 ok\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept\r\ndate: ${new Date()}/r/nContent-Length: ${body.length}\r\n${getContentType(reqObj.uri)}\r\n\r\n`
        )
        response.result = Buffer.concat([res, body])
        return true
      } catch (error) {
        return null
      }
    }
    return null
  }
