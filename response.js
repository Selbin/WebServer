const reqParser = require('./reqParser')
const fs = require('fs').promises
const path = require('path')

function getContentType (uri) {
  const contentType = {
    js: 'application/js',
    json: 'application/json',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    '': 'text/html'
  }
  return `Content-Type: ${contentType[path.extname(uri).slice(1)]}`
}
async function createResponse (reqObj) {
  if (reqObj.method === 'GET') {
    try {
      let res =
        'HTTP/1.1 200 ok\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept\r\n'
      const body = await fs.readFile('.' + reqObj.uri)
      res += `Content-Length: ${Buffer}`
    } catch (error) {}
  }
}
