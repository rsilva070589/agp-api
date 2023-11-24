
const usuarios = require('../model/funcoes');

async function get(req, res, next) {
  try {
    const context = {};

    context.MES = req.params.MES?.replace('-','/'); 

    const rows = await usuarios.find(context);

    console.log(context)

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
  const item = {  
    COD_EMPRESA: req.body.COD_EMPRESA,
    NOME_EMPRESA: req.body.NOME_EMPRESA,
    NOME: req.body.NOME,
    NOME_COMPLETO: req.body.NOME_COMPLETO,
    COD_FUNCAO: req.body.COD_FUNCAO,
    FUNCAO: req.body.FUNCAO,
    DPTO: req.body.DPTO,    
    GESTOR: req.body.GESTOR,
    MARCA: req.body.MARCA, 
    MES: req.body.MES,
    DIRETORIA: req.body.DIRETORIA, 
    FERIAS: req.body.FERIAS,
    PERIODO_INI: req.body.PERIODO_INI,
    PERIODO_FIM: req.body.PERIODO_FIM
  };
  return item;
}

async function post(req, res, next) {
  try {
    let item = getItemFromRec(req);

  item = await usuarios.create(item);

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

async function put(req, res, next) {
  try {
    let usuario = getItemFromRec(req);
    usuario = await usuarios.update(usuario);

    if (usuario !== null) {
      res.status(200).json(usuario);
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
    const MES  = req.body.MES;
    const NOME  = req.body.NOME;
    console.log('DELETANDO: '+NOME+' - '+MES)

    const success = await usuarios.delete(NOME,MES);

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

