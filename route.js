const { errorRes } = require('./response')
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

const routeParser = async function (reqObj, routes, middlewares) {
  reqObj.params = {}
  const routeUrl = uParamsParse(reqObj.uri)
  const keys = Object.keys(routes)
  // const sortUrl = keys.filter(key => /^(\/[^:]*)*$/.test(key))
  // keys.forEach(key => {
  //   if (!sortUrl.includes(key)) sortUrl.push(key)
  // })
  for (const route of keys) {
    let count = 0
    const test = uParamsParse(route)
    for (let i = 0; i < routeUrl.length; i++) {
      if (test[i].startsWith(':')) {
        reqObj.params[test[i].slice(1)] = routeUrl[i]
        count++
      } else {
        if (routeUrl[i] !== test[i]) break
        count++
      }
    }
    if (count === test.length) {
      try {
        const response = {}
        response.status = function (res) {
          let responseString = `HTTP/1.1 ${res}\r\n`
          responseString +=
            'Access-Control-Allow-Origin: *\r\nAccess-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept\r\n'
          responseString += `date: ${new Date()}/r/n`
          response.result = responseString
          return response
        }
        response.send = function (res) {
          const body = Buffer.from(JSON.stringify(res))
          let responseString = response.result
          responseString += 'Content-Type: *\r\n'
          responseString += `Content-Length: ${body.length}\r\n\r\n`
          responseString = Buffer.from(responseString)
          responseString = Buffer.concat([responseString, body])
          response.result = responseString
          return response
        }
        const execute = [...middlewares, routes[route][reqObj.method]]
        for (const fun of execute) {
          fun(reqObj, response)
        }
        return response.result
      } catch (error) {
        // console.log(error)
        const res = await errorRes()
        return res
      }
    }
  }
}

module.exports = { routeParser }
