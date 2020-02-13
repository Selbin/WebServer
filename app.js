const serveStatic = require('./servestatic')
const { app } = require('./server')

app.use(serveStatic('/test'))
app.get('/list/hi/:id1/:id2', (req, res) => {
  res.status(200).send(req.body)
  return res
})
app.post('/list/hi', (req, res) => {
  res.status(200).send(req.body)
  return res
})
app.listen(3000)
