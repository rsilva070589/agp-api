
const regras = require('../model/regracomissao');

async function get(req, res, next) {
  try {
    const context = {}; 
    context.id = req.params.id?.replace('-','/');

    const rows = await regras.find(context);
    

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


function getRegraFromRec(req) {
  const regra = { 
    ID: req.body.ID,   
    MES: req.body.MES,
    COD_EMPRESA: req.body.COD_EMPRESA,
    COD_FUNCAO: req.body.COD_FUNCAO,
    TIPO_COMISSAO: req.body.TIPO_COMISSAO,
    QTDE: req.body.QTDE,
    PERC: req.body.PERC,
    VALOR: req.body.VALOR, 
    PREMIO: req.body.PREMIO,
    QTDE_MIN: req.body.QTDE_MIN,
    QTDE_MAX: req.body.QTDE_MAX,
    MEDIA_ACESSORIOS_MIN: req.body.MEDIA_ACESSORIOS_MIN,                                                                          
    MEDIA_ACESSORIOS_MAX: req.body.MEDIA_ACESSORIOS_MAX,
    USA_FAIXA: req.body.USA_FAIXA,
    PERMITE_AVULSO: req.body.PERMITE_AVULSO,
    VALOR_MIN: req.body.VALOR_MIN,
    VALOR_MAX: req.body.VALOR_MAX,
    MES: req.body.MES,
    PAGAR_GESTOR: req.body.PAGAR_GESTOR,     
    META: req.body.META, 
    DSR: req.body.DSR, 
    PERC_MIN: req.body.PERC_MIN,
    PERC_MAX: req.body.PERC_MAX, 
    GRUPO: req.body.GRUPO,
    CLASSE: req.body.CLASSE,
    APELIDO: req.body.APELIDO,
    CAMPANHA: req.body.CAMPANHA,
    LEGENDA: req.body.LEGENDA
  };

  return regra;
}

async function post(req, res, next) {
  try {
    let regra = getRegraFromRec(req);

     await regras.create(regra); 
     res.status(201).json(regra);
    
  } catch (err) { 
    next(err)

  }
}

module.exports.post = post;

async function put(req, res, next) {
  try {
    let regra = getRegraFromRec(req);

    regra.ID = parseInt(req.params.id, 10);
    console.log(regra.ID)
    regra = await regras.update(regra);

    if (regra !== null) {
      res.status(200).json(regra);
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
    console.log(id)

    const success = await regras.delete(id);

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

 