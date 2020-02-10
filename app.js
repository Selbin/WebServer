const { bodyParser } = require('./bodyParser')
const { app } = require('./server')
app.use(bodyParser)
app.listen(3000)
app.get('/list/hi/:id1/:id2', (req, res) => {
  res.status(200).send(req.params.id1)
  return res
})
app.post('/list/hi', (req, res) => {
  // console.log(req.query.id1)
  // console.log(req.query.id2)
  res.status(200).send(req.body)
  return res
})
