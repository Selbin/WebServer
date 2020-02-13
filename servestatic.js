const fs = require('fs').promises
const getContentType = require('./getContentType')

module.exports = (path) => async function serveStatic (reqObj, response) {
  if (reqObj.method === 'GET') {
    try {
      if (!reqObj.uri.includes(path)) return null
      let res =
        'HTTP/1.1 200 ok\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept\r\n'
      if (reqObj.uri === '/') reqObj.uri = '/index.html'
      const body = Buffer.from(await fs.readFile('.' + reqObj.uri))
      res += `date: ${new Date()}/r/n`
      res += `Content-Length: ${body.length}\r\n`
      res += getContentType(reqObj.uri) + '\r\n\r\n'
      res = Buffer.from(res)
      res = Buffer.concat([res, body])
      response.result = res
      return true
    } catch (error) {
      return null
    }
  }
  return null
}
