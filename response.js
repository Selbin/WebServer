async function errorRes () {
  let res = 'HTTP/1.0 400 Bad Request\r\nContent-Type: text/html\r\n'
  const body = Buffer.from(
    ' <html><head><title>400 Bad Request</title><head><body><center><h1>400 Bad Request</h1></center></body></html>'
  )
  res += `Content-Length: ${body.length}\r\n\r\n`
  res = Buffer.from(res)
  res = Buffer.concat([res, body])
  return res
}

module.exports = { errorRes }
