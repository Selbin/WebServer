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
    let reqStr = ''
    let bodyFlag = false
    let body = ''
    socket.on('data', async data => {
      if (!bodyFlag) {
        reqStr += data.toString()
        if (reqStr.includes('\r\n\r\n')) {
          bodyFlag = true
          reqStr = reqStr.split('\r\n\r\n')
          reqStr = reqStr[0]
          body = Buffer.from(reqStr[1])
        }
      }
      if (bodyFlag) {
        const reqObj = reqParser(reqStr)
        console.log(reqObj['Content-Length'])
        if (reqObj.headers['Content-Length'] > 0) {
          body = Buffer.concat([body, data])
          console.log(body.byteLength + '    ' + reqObj.headers['Content-Length'])
          if (body.byteLength === 155815) {
            reqObj.body = JSON.stringify(body.toString())
            let res = await serveStatic(reqObj)
            if (res === null) res = await routeParser(reqObj, routes, middlewares)
            socket.end(Buffer.from(res))
          }
        }
      }
    })

    socket.once('close', () => {
      console.log('connection closed ' + remoteAddr)
    })

    socket.on('error', err => {
      console.log(
        '---------------------server crashed--------------------------'
      )
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
