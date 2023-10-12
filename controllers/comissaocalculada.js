
const empresas = require('../model/comissaocalculada');

async function get(req, res, next) {
  try {
    const context = {};

 
    context.MES = req.query.MES
    context.MARCA = req.query.MARCA 

    const rows = await empresas.find(context);

    if (req.params.MES) {
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
