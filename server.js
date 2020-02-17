const net = require('net')
const { reqParser } = require('./reqParser')
const { routeParser } = require('./route')
const server = net.createServer()
const bodyParser = require('./bodyParser')
const routes = {}

const middlewares = [bodyParser]

function createServer (port) {
  server.on('connection', socket => {
    const remoteAddr = socket.remoteAddress + ':' + socket.remotePort
    console.log('new client joined', remoteAddr)
    let reqStr = ''
    let bodyFlag = false
    let body = ''
    let reqObj
    socket.on('data', async data => {
      if (!bodyFlag) {
        reqStr = data
        const headerLen = reqStr.indexOf('\r\n\r\n')
        data = Buffer.from('')
        if (headerLen !== -1) {
          body = reqStr.slice(headerLen + 4)
          reqStr = reqStr.slice(0, headerLen)
          bodyFlag = true
          reqObj = reqParser(reqStr)
        }
        if (reqObj.Connection === 'keep-alive') socket.setKeepAlive(true, 10)
      }
      if (!reqObj['Content-Length']) {
        const res = await routeParser(reqObj, routes, middlewares)
        return socket.end(Buffer.from(res))
      }
      body = Buffer.concat([body, data])

      if (body.byteLength === reqObj['Content-Length'] * 1) {
        reqObj.body = body
        console.log(reqObj.body.byteLength, reqObj['Content-Length'] * 1)
        const res = await routeParser(reqObj, routes, middlewares)
        return socket.end(Buffer.from(res))
      }
    })

    socket.once('close', () => {
      console.log('connection closed ' + remoteAddr)
    })

    socket.on('error', err => {
      console.log('error ' + remoteAddr + ': ' + err.message)
    })
  })

  server.listen(port, () => {
    console.log('listening on port: ', server.address())
  })
}

const app = {
  listen: port => {
    createServer(port)
  },
  use: middleware => {
    middlewares.push(middleware)
  },
  get: (path, fun) => {
    if (routes[path] === undefined) routes[path] = {}
    routes[path] = Object.assign(routes[path], { GET: fun })
  },
  post: (path, fun) => {
    if (routes[path] === undefined) routes[path] = {}
    routes[path] = Object.assign(routes[path], { POST: fun })
  },
  put: (path, fun) => {
    if (routes[path] === undefined) routes[path] = {}
    routes[path] = Object.assign(routes[path], { PUT: fun })
  },
  delete: (path, fun) => {
    if (routes[path] === undefined) routes[path] = {}
    routes[path] = Object.assign(routes[path], { DELETE: fun })
  }
}

module.exports = { app }
