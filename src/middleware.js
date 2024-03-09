module.exports = (req, res, next) => {
  // JSON server supports full crud operations but the db and API 
  // structures are mismatching, we can revisit this logic if required
  if (
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'PATCH'
  ) {
    req.method = 'GET'
  }

  res.header('x-powered-by', 'json-server')
  next()
 }