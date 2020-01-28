const net = require('net')

const server = net.createServer()

server.on('connection', (socket) => {
  const remoteAddr = socket.remoteAddress + ':' + socket.remotePort
  console.log('new client joined', remoteAddr)

  socket.on('data', (data) => {
    console.log('data from ' + remoteAddr + ': ' + data)
    socket.write('hello ' + data)
  })

  socket.once('close', () => {
    console.log('connection closed ' + remoteAddr)
  })

  socket.on('error', (err) => {
    console.log('error ' + remoteAddr + ': ' + err.message)
  })
})

server.listen(6000, () => {
  console.log('listening on port: ', server.address())
})
