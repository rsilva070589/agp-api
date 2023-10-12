const database = require('../services/database.js');

const baseQuery = 
`select 
      m.cod_marca,
      m.descricao_marca,
      pm.cod_produto,
      p.descricao_produto,
      pm.cod_modelo,
      pm.descricao_modelo,
      P.NOVO_USADO,
      pm.ANO_MODELO
  from nbs.marcas m,
       nbs.produtos p,
       nbs.produtos_modelos pm
  where m.cod_marca     = p.cod_marca
      and p.cod_produto = pm.cod_produto
      and pm.ATIVO = 'S' `;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) { 
    binds.tipo_id = context.id;
    console.log(context.id)
    query += `\and pm.cod_modelo = :tipo_id`;
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;
