const net = require('net')
const { reqParser } = require('./reqParser')
const { routeParser } = require('./route')
const server = net.createServer()
const { createResponse } = require('./servestatic')
const routes = {
  '/list/todo/a/v': {
    GET: (req, res) => {
      return req.params.listid1
    },
    POST: (req, res) => {
      return req.params.listid1
    }
  },
  '/list/todo/:listid1/:listid2': {
    GET: (req, res) => {
      return req.params.listid1
    },
    POST: (req, res) => {
      return req.params.listid2
    }
  },
  '/list/ggg/gd': {
    GET: (req, res) => {
      return req.params.listid1
    },
    POST: (req, res) => {
      return req.params.listid2
    }
  }
}
function createServer (port) {
  server.on('connection', socket => {
    const remoteAddr = socket.remoteAddress + ':' + socket.remotePort
    console.log('new client joined', remoteAddr)

    socket.on('data', async data => {
      let res = await createResponse(reqParser(data))
      if (res === null) res = routeParser(data, routes)
      console.log(res)
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
  }
}

module.exports = { app }
