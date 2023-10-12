
const frotas = require('../model/frota');

async function get(req, res, next) {
  try {
    const context = {};

    context.id = parseInt(req.params.id, 10);
    context.CHASSI = req.query.CHASSI;
    context.PLACA = req.query.PLACA;

    const rows = await frotas.find(context);

    if (req.params.id) {
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

module.exports.get = get;