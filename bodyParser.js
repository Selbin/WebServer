function bodyParser (req, res) {
  if (!req.body) return null
  if (req['Content-Type'] === 'application/json') {
    req.body = JSON.parse(req.body)
  }
  if (req['Content-Type'] === 'application/x-www-form-urlencoded') {
    const dataStrings = req.body.split('&')
    const body = {}
    dataStrings.forEach(keyValues => {
      body[keyValues.split('=')[0].trim()] = keyValues.split('=')[1].trim()
    })
    req.body = body
  }
}

module.exports = bodyParser
