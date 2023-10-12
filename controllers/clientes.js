const clientes = require('../model/clientes');

async function get(req, res, next) {
  try {
    const context = {};

    context.id = parseInt(req.params.id, 10);
    context.skip = parseInt(req.query.skip, 10);
    context.limit = parseInt(req.query.limit, 10);
    context.sort = req.query.sort;
    context.NOME = req.query.NOME; 

    const rows = await clientes.find(context);

    if (req.params.id) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
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

function getCLienteFromRec(req) {
  const CLIENTE = {
    COD_CLIENTE: req.body.COD_CLIENTE,
    NOME: req.body.NOME,
    ENDERECO_ELETRONICO: req.body.ENDERECO_ELETRONICO,
    RUA_RES: req.body.RUA_RES,
    FACHADA_RES: req.body.FACHADA_RES,
    COMPLEMENTO_RES: req.body.COMPLEMENTO_RES,
    BAIRRO_RES: req.body.BAIRRO_RES,
    COD_CID_RES: req.body.COD_CID_RES,
    CEP_RES: req.body.CEP_RES,
    UF_RES: req.body.UF_RES,
    PREFIXO_CEL: req.body.PREFIXO_CEL,
    TELEFONE_CEL: req.body.TELEFONE_CEL,
    CPF: req.body.CPF,
    COD_SEXO: req.body.COD_SEXO,
    COD_ESTADO_CIVIL: req.body.COD_ESTADO_CIVIL,
    ANIVERSARIO: req.body.ANIVERSARIO,
    PAI: req.body.PAI,
    MAE: req.body.MAE, 
    RG_NUMERO: req.body.RG_NUMERO,
    RG_EMISSOR: req.body.RG_EMISSOR,
    RG_DATA_EMISSAO: req.body.RG_DATA_EMISSAO,
    ESCOLARIDADE: req.body.ESCOLARIDADE,
    COD_PROFISSAO: req.body.COD_PROFISSAO,
    ANIVERSARIO: req.body.ANIVERSARIO
  };

  return CLIENTE;
}



function getCLienteFromUpdate(req) {
  const ClientUP = { 
    ENDERECO_ELETRONICO: req.body.ENDERECO_ELETRONICO,
    RUA_RES: req.body.RUA_RES,
    FACHADA_RES: req.body.FACHADA_RES,
    COMPLEMENTO_RES: req.body.COMPLEMENTO_RES,
    BAIRRO_RES: req.body.BAIRRO_RES,
    COD_CID_RES: req.body.COD_CID_RES,
    CEP_RES: req.body.CEP_RES,
    UF_RES: req.body.UF_RES,
    PREFIXO_CEL: req.body.PREFIXO_CEL,
    TELEFONE_CEL: req.body.TELEFONE_CEL    
  };

  return ClientUP;
}


async function post(req, res, next) {
  try {
    let cliente = getCLienteFromRec(req);

    cliente = await clientes.create(cliente);

    res.status(201).json(cliente);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

 
async function put(req, res, next) {
  try {
    let client = getCLienteFromUpdate(req);

    client.ID = parseInt(req.params.id, 10);
    console.log(client.ID)
    client = await clientes.update(client);

    if (client !== null) {
      res.status(200).json(client);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.put = put;

/*
async function del(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    const success = await employees.delete(id);

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

*/