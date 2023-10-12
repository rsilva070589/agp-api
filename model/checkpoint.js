const res = require('express/lib/response.js');
const database = require('../services/database.js');

const baseQuery = 
`select *
   from agpdev.checkpoint
   order by cod_tipo   
`;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) { 
    binds.tipo_id = context.id;
    console.log(context.id)
    query += `\where cod_tipo = :tipo_id`;
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows
}



module.exports.find = find;
