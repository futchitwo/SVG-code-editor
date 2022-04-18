const atob = require('atob');
exports.default = (req, res) => {
  const body = decodeURIComponent(escape(atob(req.query.q.replaceAll(' ', '+'))));
  res.setHeader('Content-Type','image/svg+xml').send(body);
}