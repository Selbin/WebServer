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
        reqStr += data.toString()
        data = ''
        if (reqStr.includes('\r\n\r\n')) {
          reqStr = reqStr.split('\r\n\r\n')
          body = reqStr.slice(1)
          reqStr = reqStr[0]
          bodyFlag = true
          reqObj = reqParser(reqStr)
        }
      }
      if (!reqObj['Content-Length']) {
        const res = await routeParser(reqObj, routes, middlewares)
        return socket.end(Buffer.from(res))
      }
      body += data.toString()
      if (Buffer.from(body).byteLength === reqObj['Content-Length'] * 1) {
        reqObj.body = body
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
