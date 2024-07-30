
const vianuvem = require('../model/painel');

async function get(req, res, next) {
  try { 
    const rows = await vianuvem.find(req.body);

    if (1) {
      if (1) {
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