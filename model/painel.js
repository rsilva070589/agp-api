const res = require('express/lib/response.js');
const database = require('../services/database.js');

const baseQuery = 
`select *
   from agpdev.vw_painel 
  where 1=1
`;

async function find(context) {
console.log(context)

  let query = baseQuery;
  const binds = {};

  if (context.MES) { 
    binds.MES_VENDA = context.MES; 
    query += `\and MES_VENDA = :MES_VENDA`;
  }
   
  const result = await database.simpleExecute(query, binds);
 
  return result.rows
}



module.exports.find = find;
