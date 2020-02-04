const fs = require('fs').promises

async function errorRes () {
  let res = 'HTTP/1.0 400 Bad Request\r\nContent-Type: text/html\r\n'
  const body = Buffer.from(await fs.readFile('./error.html'))
  res += `Content-Length: ${body.length}\r\n\r\n`
  res = Buffer.from(res)
  res = Buffer.concat([res, body])
  return res
}

// function successRes (res) {
//   return res.responseString
// }

module.exports = { errorRes }
