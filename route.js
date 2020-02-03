const { reqParser } = require('./reqParser')
// const routeParser = function (req) {
//   reqObj = {}
//   const reqString = req.toString().split('\r\n')
//   const firstString = reqString[0].split(' ')
//   reqObj.method = firstString[0]
//   if (!firstString[1].startsWith('/')) throw new Error('invalid route')
//   const routeString = firstString[1].slice('/')

//   reqObj.params = {}
//   reqObj.httpVersion = firstString[2]
// }
function uParamsParse (uri) {
  const routeUrl = uri.split('/').slice(1)
  return routeUrl
}

const routeParser = function (req, routes) {
  const reqObj = reqParser(req)
  reqObj.params = {}
  const routeUrl = uParamsParse(reqObj.uri)
  const keys = Object.keys(routes)
  const sortUrl = keys.filter(key => /^(\/[^:]*)*$/.test(key))
  keys.forEach(key => {
    if (!(sortUrl.includes(key))) sortUrl.push(key)
  })
  for (const route of sortUrl) {
    let count = 0
    const test = uParamsParse(route)
    for (let i = 0; i < test.length; i++) {
      if (test[i].startsWith(':')) {
        reqObj.params[test[i].slice(1)] = routeUrl[i]
        count++
      } else {
        if (routeUrl[i] !== test[i]) break
        count++
      }
    }
    if (count === test.length) {
      return routes[route][reqObj.method](reqObj)
    }
  }
}

module.exports = { routeParser }
