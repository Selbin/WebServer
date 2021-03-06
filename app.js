const serveStatic = require('./servestatic')
const { app } = require('./server')
const cookie = require('./cookieParser')

app.use(serveStatic('/test'))
app.use(cookie)

app.get('/list/hi/:id1/:id2', (req, res) => {
  res.status(200).send(req.params)
  return res
})
app.get('/list/hi', (req, res) => {
  res.cookie('selbin', 'hi', { Expires: 'das' })
  res.cookie('bin', 'hi')
  res.status(200).send('{2:3}')
  return res
})
app.post('/upload', (req, res) => res.status(200).send('successful'))
app.listen(3000)
