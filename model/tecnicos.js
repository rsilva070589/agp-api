const database = require('../services/database.js');

const baseQuery = 
`select * from (
SELECT EU.COD_EMPRESA,
       EU.NOME as LOGIN,
       EU.NOME_COMPLETO,
       EU.COD_FUNCAO as cod_tecnico,
       EF.DESCRICAO,
       '' BOX,
       'CONSULTOR' TIPO
  FROM PARM_SYS P, EMPRESAS_USUARIOS EU, EMPRESAS_FUNCOES EF
 WHERE P.COD_EMPRESA = EU.COD_EMPRESA
   AND P.COD_RECEPCIONISTA = EU.COD_FUNCAO
   AND EF.COD_FUNCAO = EU.COD_FUNCAO
 
UNION ALL

select 
      st.cod_empresa,
      '' login,
      st.nome, 
      st.cod_tecnico,
      ST.FUNCAO,
      pb.prisma box,
      'PRODUTIVO' TIPO
from  servicos_tecnicos st,
      prisma_box pb
where st.ativo = 'S'
  and st.cod_empresa = pb.cod_empresa_filtro
  and st.cod_tecnico = pb.cod_tecnico
  AND PB.PRISMA IS NOT NULL
  )   
   `;

async function find(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) { 
    binds.tipo_id = context.id;
    console.log(context.id)
    query += `\and pm.cod_tecnico = :tipo_id`;
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;
