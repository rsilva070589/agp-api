const database = require('../services/database.js');

const baseQuery = 
`select 
    s.cod_servico,
    s.descricao_servico, 
    round (s.tempo_padrao,1) tempo_padrao, 
    round (s.preco_venda,2) preco_venda,
    s.terceiros
 from servicos s`;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) { 
    binds.tipo_id = context.id;
    console.log(context.id)
    query += `\and s.cod_servico = :tipo_id`;
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;
