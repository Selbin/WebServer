const { errorRes, setStatus, setResponse } = require('./response')
const serveStatic = require('./servestatic')

function splitAtSlash (uri) {
  const routeUrl = uri.split('/').slice(1)
  return routeUrl
}

function matchRoute (route, routeUrl, reqObj) {
  let count = 0
  reqObj.params = {}
  const routePart = splitAtSlash(route)
  for (let i = 0; i < routeUrl.length; i++) {
    if (routePart[i] !== undefined && routePart[i].startsWith(':')) {
      reqObj.params[routePart[i].slice(1)] = routeUrl[i]
      count++
    } else {
      if (routeUrl[i] !== routePart[i]) break
      count++
    }
  }
  if (count === routeUrl.length) return true
}

const routeParser = async function (reqObj, routes, middlewares) {
  const staticFile = await serveStatic(reqObj)
  if (staticFile) return staticFile
  const routeUrl = splitAtSlash(reqObj.uri)
  const keys = Object.keys(routes)
  for (const route of keys) {
    if (matchRoute(route, routeUrl, reqObj)) {
      try {
        const response = { status: setStatus, send: setResponse }
        if (routes[route][reqObj.method] !== undefined) {
          for (const handler of [...middlewares, routes[route][reqObj.method]]) {
            await handler(reqObj, response)
          }
          return response.result
        }
      } catch (error) {
        console.log(error)
        const res = errorRes()
        return res
      }
    }
  }
  const res = errorRes()
  return res
}

module.exports = { routeParser }
