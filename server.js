const net = require('net')
const { reqParser } = require('./reqParser')
const { routeParser } = require('./route')
const server = net.createServer()
const { serveStatic } = require('./servestatic')
const routes = {}

const middlewares = []
function createServer (port) {
  server.on('connection', socket => {
    const remoteAddr = socket.remoteAddress + ':' + socket.remotePort
    console.log('new client joined', remoteAddr)

    socket.on('data', async data => {
      const req = reqParser(data)
      let res = await serveStatic(req)
      if (res === null) res = await routeParser(req, routes, middlewares)
      socket.end(Buffer.from(res))
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
