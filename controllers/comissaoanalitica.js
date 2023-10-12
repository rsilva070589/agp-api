
const modelComissao = require('../model/comissaoanalitica');

async function get(req, res, next) {
  try {
    const context = {};

    context.EMPRESA = parseInt(req.query.EMPRESA, 10);
    context.MES = req.query.MES
    context.MARCA = req.query.MARCA
    console.log(req.query)

    const rows = await modelComissao.find(context);

    if (req.params.EMPRESA) {
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