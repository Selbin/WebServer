function bodyParser (req, res) {
  if (req.headers['Content-Type'] === 'application/json') {
    if (!req.body) return 0
    console.log(req.body)
    req.body = JSON.parse(req.body)
  }
  if (req.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    if (!req.body) return 0
    const dataStrings = req.body.split('&')
    const body = {}
    dataStrings.forEach(keyValues => {
      body[keyValues.split('=')[0].trim()] = keyValues.split('=')[1].trim()
    })
    req.body = body
  }
}

module.exports = { bodyParser }
