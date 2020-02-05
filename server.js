const net = require('net')
const { reqParser } = require('./reqParser')
const { routeParser } = require('./route')
const server = net.createServer()
const { serveStatic } = require('./servestatic')
const routes = {
  '/list/todo/:listid1/:listid2': {
    GET: (req, res) => {
      return req.params.listid1
    },
    POST: (req, res) => {
      return req.params.listid2
    }
  }
}

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
  use: (middleware) => {
    middlewares.push(middleware)
  },
  get: (path, fun) => {
    routes[path] = { GET: {} }
    routes[path].GET = fun
  },
  post: (path, fun) => {
    routes[path] = { POST: {} }
    routes[path].POST = fun
  },
  put: (path, fun) => {
    routes[path] = { PUT: {} }
    routes[path].PUT = fun
  },
  delete: (path, fun) => {
    routes[path] = { DELETE: {} }
    routes[path].DELETE = fun
  }
}

module.exports = { app }
