function errorRes () {
  let res = 'HTTP/1.0 400 Bad Request\r\nContent-Type: text/html\r\n'
  const body = Buffer.from(
    ' <html><head><title>400 Bad Request</title><head><body><center><h1>400 Bad Request</h1></center></body></html>'
  )
  res += `Content-Length: ${body.length}\r\n\r\n`
  res = Buffer.from(res)
  res = Buffer.concat([res, body])
  return res
}

function setStatus (code) {
  console.log(this)
  let responseString = `HTTP/1.1 ${code}\r\n`
  responseString +=
    'Access-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept\r\n'
  responseString += `date: ${new Date()}/r/n`
  this.result = responseString
  return this
}

function setResponse (res) {
  const body = Buffer.from(JSON.stringify(res))
  let responseString = this.result
  responseString += 'Content-Type: *\r\n'
  responseString += `Content-Length: ${body.length}\r\n\r\n`
  responseString = Buffer.from(responseString)
  responseString = Buffer.concat([responseString, body])
  this.result = responseString
  return this
}

module.exports = { errorRes, setStatus, setResponse }
