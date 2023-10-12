
const modelIntegracao = require('../model/integracao');

async function get(req, res, next) {
  try {
    const context = {};
 
    context.CPF = req.body.CPF
    context.MES = req.body.MES
    context.NOME = req.body.NOME
    console.log(req.body)

    const rows = await modelIntegracao.find(context);

    if (req.params.CPF) {
      if (!rows.length > 0) {
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