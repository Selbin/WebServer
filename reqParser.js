const reqParser = function (req) {
  const reqObj = {}
  const reqString = req.toString().split('\r\n')
  const firstString = reqString[0].split(' ')
  reqObj.method = firstString[0]
  if (!firstString[1].startsWith('/')) throw new Error('invalid request')
  reqObj.uri = firstString[1]
  reqObj.httpVersion = firstString[2]

  reqObj.headers = {}
  for (let i = 1; i < reqString.length - 2; i++) {
    const header = reqString[i].split(': ')
    reqObj.headers[header[0]] = header[1].trim()
  }
  return reqObj
}

module.exports = { reqParser }
