function cookieParser (req, res) {
  if (!req.Cookie) return null
  const cookies = req.Cookie.split(';')
  req.Cookie = { }
  for (let cookie of cookies) {
    cookie = cookie.trim()
    req.Cookie[cookie.split('=')[0]] = cookie.split('=')[1]
  }
}

module.exports = cookieParser
