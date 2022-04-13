const app = require("fastify")();
const atob = require("atob");

app.get('/svg/*', (req,res) => {
  const body = decodeURIComponent(escape(atob(req.params["*"])));
  res.header('Content-Type','image/svg+xml');
  res.send(body);
});

exports.default = async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
};

app.listen(3000,'0.0.0.0');