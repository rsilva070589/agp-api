const database = require('../services/database.js');

const baseQuery = 
`select CONSTRAINT_NAME,TABLE_NAME
   from all_constraints 
`;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) { 
    binds.tipo_id = context.id;
    console.log(context.id) 
    query += `\where CONSTRAINT_NAME = :tipo_id`;
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;
