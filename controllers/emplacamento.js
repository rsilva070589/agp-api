
const emplacamento = require('../model/emplacamento');

async function get(req, res, next) {
  try { 
    const rows = await emplacamento.find();

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

async function validacao(req, res, next) {
  try { 

    const rows = await emplacamento.validacao(req.body); 
     res.status(200).json(rows);
    
  } catch (err) { 
    next(err)

  }
}

module.exports.validacao = validacao;