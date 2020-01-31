const net = require('net')
const { reqParser } = require('./reqParser')
const server = net.createServer()

function createServer (port) {
  server.on('connection', socket => {
    const remoteAddr = socket.remoteAddress + ':' + socket.remotePort
    console.log('new client joined', remoteAddr)

    socket.on('data', data => {
      console.log(data.toString())
      console.log(reqParser(data))
      socket.write(data)
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
  listen: (port) => {
    createServer(port)
  }
}

module.exports = { app }
