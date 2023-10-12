
const cidades = require('../model/constraint');

async function get(req, res, next) {
  try {
    const context = {};

    context.id = parseInt(req.params.id, 15);

    const rows = await cidades.find(context);

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