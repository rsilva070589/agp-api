
const comissaofacil = require('../model/comissaofacil');

async function get(req, res, next) {
  try {
    const context = {};

    context.MES = req.params.MES?.replace('-','/');  

    const rows = await comissaofacil.find(context);

    if (1) {
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


function getItemFromRec(req) {
  const itemAvulso = {  
    COD_EMPRESA: req.body.COD_EMPRESA,
    TIPO: req.body.TIPO,
    VENDEDOR: req.body.VENDEDOR,
    DATA: req.body.DATA,
    COD_CLIENTE: req.body.COD_CLIENTE,
    CHASSI: req.body.CHASSI,
    REGISTRO: req.body.REGISTRO,    
    DESC_ITEM: req.body.DESC_ITEM,
    ANO_MODELO: req.body.ANO_MODELO, 
    VALOR: req.body.VALOR,
    FAMILIA: req.body.FAMILIA,
    MODELO:  req.body.MODELO,
    DIA:     req.body.DIA,
    STATUS:   req.body.STATUS,
    GRUPO_COTA:   req.body.GRUPO_COTA
  };

  return itemAvulso;
}

async function post(req, res, next) {
  try {
    let item = getItemFromRec(req);

  item = await comissaofacil.create(item);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

async function put(req, res, next) {
  try {
 
    let item = getItemFromRec(req);
    item = await comissaofacil.update(item, req.params.id); 
    

   

    if (req.params) {
      res.status(200).json(item);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.put = put;

 
async function del(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    console.log(req.params)

    const success = await comissaofacil.delete(id);

    if (success) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.delete = del;
