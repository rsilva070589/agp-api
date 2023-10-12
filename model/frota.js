const database = require('../services/database.js');

const baseQuery = 
`select pm.descricao_modelo,       
cf.cod_modelo,
cf.chassi,
cf.placa,
cf.ano,
cf.cor_veiculo,
cf.data_compra,
cf.km,
cf.data_km,
cf.cod_cliente
from    clientes_frota cf, 
produtos_modelos pm
where  nvl(cf.vendido,'N') <> 'S'
and    cf.cod_produto=pm.cod_produto
and    cf.cod_modelo=pm.cod_modelo
`;

const sortableColumns = ['id', 'nome'];

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) { 
    binds.tipo_id = context.id;
    console.log(context.id)
    query += `\and st.cod_tecnico = :tipo_id`;
  }

  if (context.CHASSI) {
    binds.CHASSI = context.CHASSI;
    console.log(context.CHASSI) 
    query += '\nand CHASSI LIKE :CHASSI';
  }

  if (context.PLACA) {
    binds.PLACA = context.PLACA;
    console.log(context.PLACA) 
    query += '\nand PLACA LIKE :PLACA';
  }
  
  if (context.sort === undefined) {
    query += '\norder by NOME asc';
  } else {
    let [column, order] = context.sort.split(':');
 
    if (!sortableColumns.includes(column)) {
      throw new Error('Invalid "sort" column');
    }
 
    if (order === undefined) {
      order = 'asc';
    }
 
    if (order !== 'asc' && order !== 'desc') {
      throw new Error('Invalid "sort" order');
    }
 
    query += `\norder by "${column}" ${order}`;
  }

  if (context.skip) {
    binds.row_offset = context.skip;

    query += '\noffset :row_offset rows';
  }

  const limit = (context.limit > 0) ? context.limit : 30;

  binds.row_limit = limit;

  query += '\nfetch next :row_limit rows only';

  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;

