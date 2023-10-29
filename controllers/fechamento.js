
const fechamento = require('../model/fechamento');
const context = {}; 

async function get(req, res, next) {
  console.log(req.params)
  context.ID = parseInt(req.params.ID, 10);
  context.MES = req.params.MES.replace('&','').replace('-','/')

  try { 
    const rows = await fechamento.find(context);

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

 