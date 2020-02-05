const { bodyParser } = require('./bodyParser')
const { app } = require('./server')
app.use(bodyParser)
app.listen(3000)
app.post('/list/hi/:id1/:id2', (req, res) => {
  console.log(req.body)
  res.status(200).send(req.body)
  return res
})
app.get('/list/hi', (req, res) => {
  console.log('hi')
  console.log(req.query.id1)
  console.log(req.query.id2)

  res.status(200).send(req.query.id1)
  return res
})
