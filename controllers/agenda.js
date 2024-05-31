const employees = require('../model/agenda');

async function get(req, res, next) {
  try {
    const context = {};

    context.id = parseInt(req.params.id, 10);
    context.skip = parseInt(req.query.skip, 10);
    context.limit = parseInt(req.query.limit, 10);
    context.sort = req.query.sort;
    context.department_id = parseInt(req.query.department_id, 10);
    context.manager_id = parseInt(req.query.manager_id, 10);

    const rows = await employees.find(context);

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

function getEmployeeFromRec(req) {
  const agenda = {   

    COD_EMPRESA: req.body.COD_EMPRESA,
    CONSULTOR: req.body.CONSULTOR,
    PRISMA: req.body.PRISMA,
    TIPO_ATENDIMENTO: req.body.TIPO_ATENDIMENTO,
    COD_SERVICO: req.body.COD_SERVICO,
    DATA_AGENDADA: req.body.DATA_AGENDADA,
    DATA_PREVISAO_FIM: req.body.DATA_PREVISAO_FIM,
    DATA_PROMETIDA: req.body.DATA_PROMETIDA,
    TEMPO_PADRAO: req.body.TEMPO_PADRAO,
    COD_CLIENTE: req.body.COD_CLIENTE,
    COD_PRODUTO: req.body.COD_PRODUTO,
    COD_MODELO: req.body.COD_MODELO, 
    ANO_MODELO: req.body.ANO_MODELO, 
    ANO: req.body.ANO, 
    OBSERVACAO: req.body.OBSERVACAO,
    PLACA: req.body.PLACA, 
    CHASSI: req.body.CHASSI,                                                                          
    COR_EXTERNA: req.body.COR_EXTERNA,  
    KM: req.body.KM,  
    RECLAMACAO: req.body.RECLAMACAO,
    EMAIL: req.body.EMAIL,
    DDD_CEL: req.body.DDD_CEL,
    TELEFONE_CEL: req.body.TELEFONE_CEL,    
    CLIENTE_NOME: req.body.CLIENTE_NOME
  };

  return agenda;
}

async function post(req, res, next) {
  try {
    let agenda = req.body;

  os = await employees.create(agenda);
    console.log({ 'numero_agenda': os
                })

    if  (os.length > 100) {
      res.status(201).json({  'result': 'SUCESSO',
                              'numero_agenda': os
                          });
    } else {
      res.status(400).json({ 'errors': os        
     });
    }        
    
  } catch (err) { 
    next(err)
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
*/

async function del(req, res, next) {
  try {
 console.log(req.body)

    const success = await employees.delete(req.body);

    if (success) { 
   
      res.status(202).json({  'result': 'deletado com sucesso',
                              'numero_agenda': success
      });


    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.delete = del;


