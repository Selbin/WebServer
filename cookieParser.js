function cookieParser (req, res) {
  if (!req.Cookie) return null
  const cookies = req.Cookie.split(';')
  req.Cookie = { }
  for (let cookie of cookies) {
    cookie = cookie.trim()
    req.Cookie[cookie.split('=')[0]] = cookie.split('=')[1]
  }
  for (const [key, value] of Object.entries(req.Cookie)) {
    res.cookie(key, value)
  }
}

module.exports = cookieParser
