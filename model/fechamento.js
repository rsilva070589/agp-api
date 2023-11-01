
const database = require('../services/database.js'); 

async function find(context) {
console.log(context)

  if (context?.ID == 2){
    const queryDel = 'delete from agpdev.comissao_encerrada where mes_venda = :mes_venda';
    
    const queryGrava = `insert into agpdev.comissao_encerrada
    select TIPO,COD_EMPRESA,COD_EMPRESA_VENDEDORA,MARCA,DATA_VENDA,MES_VENDA,COD_CLIENTE,NOME_CLIENTE,CHASSI,NOVO_USADO,
    DESCRICAO_MODELO,ANO_MODELO,COD_PROPOSTA,VENDEDOR,TOTAL_VENDA,QTDE,MARGEM_VENDA,DESPESAS,GANHOS,sysdate DATA_GRAVACAO
     from agpdev.vw_comissao
    where mes_venda=:mes_venda
     `
    const queryMetaDel = 'delete from AGPDEV.Meta_Vendas_Fechada where mes_venda= :mes_venda'

    const queryMeta = `insert into agpdev.meta_vendas_fechada
                      select *
                        from AGPDEV.Meta_Vendas x 
                        where mes_venda = :mes_venda`

    await database.simpleExecute(queryDel,[context.MES]);
    await database.simpleExecute(queryGrava,[context.MES]);

    await database.simpleExecute(queryMetaDel,[context.MES]);
    await database.simpleExecute(queryMeta,[context.MES]);
      
  } 
  const result = await database.simpleExecute('select max(data_gravacao)data_gravacao from agpdev.comissao_encerrada');

  console.log('Fechamento executado com sucesso')
  if (context?.ID == 2){
  return {result: 'fechamento realizado com sucesso'}
  }else{
    return result.rows
  }
  
}

module.exports.find = find;
