const database = require('../services/database.js');

async function find(context) {

  const baseQuery = 
  `select cid.uf,
          cid.cod_cidades,
          cid.descricao 
     from "`+schemaUsuario+`".cidades cid
  `;

  let query = baseQuery;
  const binds = {};

  if (context.id) { 
    binds.tipo_id = context.id;
    console.log(context.id)
    query += `\where cid.cod_cidades = :tipo_id`;
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;
