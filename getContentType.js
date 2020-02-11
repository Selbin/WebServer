const path = require('path')

function getContentType (uri) {
  const contentType = {
    js: 'application/js',
    json: 'application/json',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    mp4: 'video/mp4',
    css: 'text/css',
    png: 'image/png',
    ico: 'image/vnd',
    html: 'text/html'
  }
  console.log(uri)
  const content = contentType[path.extname(uri).slice(1)]
  if (content === undefined) throw new Error('invalid content type')
  return `Content-Type: ${content}`
}

module.exports = getContentType
