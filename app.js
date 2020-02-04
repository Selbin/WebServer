const { app } = require('./server')
app.listen(3000)
app.get('/list/hi/:id1/:id2', (req, res) => {
  console.log(req.params.id1)
  res.status(200).send(req.params.id1)
  return res
})
app.get('/list/hi', (req, res) => {
  console.log(req.query.id1)
  console.log(req.query.id2)

  res.status(200).send(req.query.id1)
  return res
})
