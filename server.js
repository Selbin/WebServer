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
    let reqStr = Buffer.from('')
    let bodyFlag = false
    let body = ''
    let reqObj
    socket.on('data', async data => {
      if (!bodyFlag) {
        reqStr = Buffer.concat([reqStr, data])
        const headerLen = reqStr.indexOf('\r\n\r\n')
        data = Buffer.from('')
        if (headerLen !== -1) {
          body = reqStr.slice(headerLen + 4)
          reqStr = reqStr.slice(0, headerLen)
          bodyFlag = true
          reqObj = reqParser(reqStr)
        }
      }
      body = Buffer.concat([body, data])
      if (!reqObj['Content-Length'] || body.byteLength === reqObj['Content-Length'] * 1) {
        reqObj.body = body
        const res = await routeParser(reqObj, routes, middlewares)
        body = Buffer.from('')
        reqStr = Buffer.from('')
        bodyFlag = false
        console.log('response served' + remoteAddr)
        return socket.write(res)
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
