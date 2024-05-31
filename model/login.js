const res = require('express/lib/response.js');
const database = require('../services/database.js');

const baseQuery = 
`select *
   from acesso
  WHERE 1=1
  and email = :usuario
`;

async function find(context) { 
  console.log(context)

  usuario = context.USUARIO
   
  const result = await database.simpleExecute(baseQuery,[usuario]);
console.log(result.rows)

  if (result.rows[0].SENHA == context.SENHA){
    return result.rows
  }else{
    return [{ 'result': 'login invalido'}]
  }

  
}
 
module.exports.find = find;
 

  
