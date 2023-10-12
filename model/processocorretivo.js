const res = require('express/lib/response.js');
const database = require('../services/database.js');

const baseQuery = 
  'begin nbs.agp_rotinas; end;';  

async function find() {
  let query = baseQuery;

  const result = await database.simpleExecute(query);
  console.log('Procedimento executado com sucesso')
  return null
}



module.exports.find = find;
