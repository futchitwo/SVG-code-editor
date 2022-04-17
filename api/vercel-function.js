const atob = require('atob');
exports.default = (req, res) => {
  const body = decodeURIComponent(escape(atob(req.query.q.replace(' ', '+'))));
  res.setHeader('Content-Type','image/svg+xml').send(body);
}