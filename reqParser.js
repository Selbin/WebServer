const reqParser = function (req) {
  const reqObj = {}
  const reqString = req.toString().split('\r\n')
  reqObj.body = reqString[reqString.length - 1]
  let [method, uri, httpVersion] = reqString[0].split(' ')
  const queryParams = uri.split('?')[1]
  uri = uri.split('?')[0]
  if (queryParams) {
    reqObj.query = {}
    const queryParamsList = queryParams.split('&')
    for (const item of queryParamsList) {
      const [key, value] = item.split('=')
      reqObj.query[key] = value
    }
  }
  Object.assign(reqObj, { method, uri, httpVersion })
  reqObj.headers = {}
  for (let i = 1; i < reqString.length - 2; i++) {
    const header = reqString[i].split(': ')
    reqObj.headers[header[0]] = header[1].trim()
  }
  return reqObj
}

module.exports = { reqParser }
