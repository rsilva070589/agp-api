const OrdemServico = require('../model/os');

async function get(req, res, next) {
  try {
    const context = {};

    context.id = parseInt(req.params.id, 10);
    context.skip = parseInt(req.query.skip, 10);
    context.limit = parseInt(req.query.limit, 10);
    context.sort = req.query.sort;
    context.department_id = parseInt(req.query.department_id, 10);
    context.manager_id = parseInt(req.query.manager_id, 10);

    const rows = await OrdemServico.find(context);

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

function getOrdemServicoFromRec(req) {
  const ordemServico = {    
    COD_EMPRESA: req.body.COD_EMPRESA,
    NUMERO_OS: req.body.NUMERO_OS,
    TIPO: req.body.TIPO,
    COD_CLIENTE: req.body.COD_CLIENTE,
    NOME: req.body.NOME,    
    COD_PRODUTO: req.body.COD_PRODUTO,
    COD_MODELO: req.body.COD_MODELO, 
    ANO: req.body.ANO, 
    CHASSI: req.body.CHASSI, 
    PLACA: req.body.PLACA,                                                                          
    COR_EXTERNA: req.body.COR_EXTERNA, 
    COMBUSTIVEL: req.body.COMBUSTIVEL,
    KM: req.body.KM,
    RECLAMACAO: req.body.RECLAMACAO
  };

  return ordemServico;
}

async function post(req, res, next) {
  try {
    let os = getOrdemServicoFromRec(req);

  os = await OrdemServico.create(os);

    res.status(201).json(os);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

/*


async function put(req, res, next) {
  try {
    let employee = getEmployeeFromRec(req);

    employee.employee_id = parseInt(req.params.id, 10);

    employee = await employees.update(employee);

    if (employee !== null) {
      res.status(200).json(employee);
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