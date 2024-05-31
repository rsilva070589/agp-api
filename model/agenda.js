//const oracledb = require('oracledb');
const { Result } = require('express-validator');
const database = require('../services/database.js');





const sortableColumns = ['id'];

 async function find(context) {

  schemaUsuario = context.SCHEMA
  const baseQuery =
  `SELECT
          COD_EMPRESA,
          COD_OS_AGENDA,
          STATUS_AGENDA,
          QUEM_ABRIU,
          DATA_ABRIDA,
          DATA_AGENDADA,
          DATA_PREVISAO_FIM,
          PRISMA,
          COD_CLIENTE,
          CLIENTE_NOME,
          CLIENTE_DDD_CEL,
          CLIENTE_FONE_CEL,
          CLIENTE_DDD_RES,
          CLIENTE_FONE_RES,
          EMAIL,
          COD_PRODUTO,
          COD_MODELO,
          CHASSI,
          PLACA,
          COR_EXTERNA,
          ANO,
          TIPO_TOYOTA,
          CLIENTE_AGUARDA,
          TIPO_ATENDIMENTO, 
          OBSERVACOES
  FROM  "`+schemaUsuario+`".OS_AGENDA OG 
  where 1=1
  and og.data_abrida > sysdate - 365
  `;

  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.employee_id = context.id; 
    query += '\and COD_OS_AGENDA= :employee_id';
  }

  const result = await database.simpleExecute(query, binds);

  return result.rows
}

module.exports.find = find;



   
  
 async function create(emp) {
  schemaUsuario = emp.SCHEMA

  const createSqlOSAgenda =
  `INSERT INTO "`+schemaUsuario+`".OS_AGENDA (
    COD_EMPRESA,
    COD_OS_AGENDA,
    STATUS_AGENDA,
    QUEM_ABRIU,
    CONSULTOR,
    PRISMA, 
    TIPO_ATENDIMENTO,
    COD_CLIENTE,  
    COD_PRODUTO,
    COD_MODELO,
    ANO_MODELO,
    ANO,
    PLACA,
    CHASSI,
    COR_EXTERNA,
    KM,  
    DATA_ULTIMA_ATUALIZACAO,
    DATA_ABRIDA, 
    DATA_AGENDADA,
    DATA_PREVISAO_FIM,
    DATA_PROMETIDA,
    TIPO_TOYOTA,
    CLIENTE_AGUARDA,
    EH_RETORNO,
    LAVAR_VEICULO,
    VEICULO_PLATAFORMA,
    TAXI,
    BLINDADO,
    TESTE_RODAGEM,
    LEVAR_PECAS_SUBSTITUIDAS,
    VEICULO_MODIFICADO,
    MOBILIDADE,
    MOBILE_OK,
    MOBILE_STATUS,
    REC_INTERATIVA,
    ORCAMENTO,
    CRM_EMAIL,
    CRM_SMS,
    CRM_MALA,
    CARTAO_DOTZ,
    TELE_CONTATO,
    TELE_HORARIO_CONTATO,
    QUICK_STOP,
    EH_FIAT_PROFISSIONAL,
    EH_PASSANTE,
    CLIENTE_DT,
    COLLABORATION,
    SERVICO_EXPRESSO,
    RECEBIDO,
    ATEND_INICIADO,
    CLIENTE_NOME,
    EMAIL,
    OBSERVACOES,
    CLIENTE_DDD_CEL,
    CLIENTE_FONE_CEL
  
    )
     VALUES
    (
    :COD_EMPRESA,
    :COD_OS_AGENDA,
    'A',
    'NBS',
    :CONSULTOR,
    :PRISMA,   
    'R',
    :COD_CLIENTE,
    :COD_PRODUTO,
    :COD_MODELO,
    :ANO_MODELO,
    :ANO,
    :PLACA,
    :CHASSI,
    :COR_EXTERNA,
    :KM,  
    sysdate,sysdate, 
    to_date(:DATA_AGENDADA,'DD/MM/YYYY HH24:MI:SS'),
    to_date(:DATA_PREVISAO_FIM,'DD/MM/YYYY HH24:MI:SS'),
    to_date(:DATA_PROMETIDA,'DD/MM/YYYY HH24:MI:SS'), 
    'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',
    :CLIENTE_NOME,
    :EMAIL,
    :OBSERVACOES,
    :DDD_CEL,
    :TELEFONE_CEL
    )    
   `
  
   const createSqlOsAgendaReclamacao =
   `INSERT INTO "`+schemaUsuario+`".OS_AGENDA_RECLAMACAO (  
    DESCRICAO,
    COD_EMPRESA,
    COD_OS_AGENDA,
    ITEM  
    )
   values ( :DESCRICAO,
            :COD_EMPRESA,
            :COD_OS_AGENDA,          
            1)
    `
  
    const createSqlOsAgendaServico =
    `INSERT INTO "`+schemaUsuario+`".OS_AGENDA_SERVICOS ( 
     COD_EMPRESA,
     COD_OS_AGENDA,
     COD_SERVICO,
     PRISMA,
     DATA_COMECA,
     DATA_FIM,
     TEMPO_PADRAO,
     TEMPO_PADRAO_SERVICO,
      STATUS,
      PRECO_VENDA,
      ITEM
     )
    values ( :COD_EMPRESA,
             :COD_OS_AGENDA,  
             :COD_SERVICO,
             :PRISMA, 
             to_date(:DATA_COMECA,'DD/MM/YYYY HH24:MI:SS'),
             to_date(:DATA_FIM,'DD/MM/YYYY HH24:MI:SS'), 
             :TEMPO_PADRAO,
             :TEMPO_PADRAO_SERVICO,
             'C',0,1)
     `

 const NEWOSAGENDA = Object.assign({}, emp);  
 const arrayErrosValidacao = []
console.log(emp)

await getUsuario()
await getBox()
await getEmpresa()
await getProdutoModelo()
SERVICO = await getServicos()
 //CheckPLACA    = await getPlaca()
 
async function gravarAgenda () {
   
async function getSequenciaAgenda() {
  const SqlNumeracaoOSAgenda = `SELECT "`+schemaUsuario+`".SEQ_COD_OS_AGENDA.NEXTVAL COD_OS_AGENDA FROM DUAL`
  const result   = await database.simpleExecute(SqlNumeracaoOSAgenda)  
  const NumeroAgenda = result.rows[0]['COD_OS_AGENDA']
  console.log(NumeroAgenda)
  return NumeroAgenda
 }

 NumeroAgenda = await getSequenciaAgenda()
 
async function  getCliente() { 
  const sqlDadosCliente = `select email_nfe,nome,cod_cliente from "`+schemaUsuario+`".clientes cli where cli.cod_cliente=:COD_CLIENTE`
  
  const dadosCliente = await database.simpleExecute(sqlDadosCliente, [NEWOSAGENDA.COD_CLIENTE])
   
  if (dadosCliente.rows[0] != undefined) {  
    COD_CLIENTE = NEWOSAGENDA.COD_CLIENTE
  }else{
    COD_CLIENTE = 1
  }
  return COD_CLIENTE
}

COD_CLIENTE= await getCliente()

console.log(COD_CLIENTE)

const TabelaOSAgenda = await database.simpleExecute(createSqlOSAgenda, 
                                                      [ 
                                                        NEWOSAGENDA.COD_EMPRESA,
                                                        NumeroAgenda,
                                                        NEWOSAGENDA.CONSULTOR,
                                                        NEWOSAGENDA.PRISMA,            
                                                        COD_CLIENTE,
                                                        NEWOSAGENDA.COD_PRODUTO,
                                                        NEWOSAGENDA.COD_MODELO,
                                                        NEWOSAGENDA.ANO_MODELO,
                                                        NEWOSAGENDA.ANO,
                                                        NEWOSAGENDA.PLACA,
                                                        NEWOSAGENDA.CHASSI,
                                                        NEWOSAGENDA.COR_EXTERNA,
                                                        NEWOSAGENDA.KM,
                                                        NEWOSAGENDA.DATA_AGENDADA,
                                                        NEWOSAGENDA.DATA_PREVISAO_FIM,
                                                        NEWOSAGENDA.DATA_PROMETIDA,
                                                        NEWOSAGENDA.CLIENTE_NOME,
                                                        NEWOSAGENDA.EMAIL,
                                                        NEWOSAGENDA.OBSERVACAO,
                                                        NEWOSAGENDA.DDD_CEL,
                                                        NEWOSAGENDA.TELEFONE_CEL
                                                      ]
                                                      , { autoCommit: true });
   
  const TabelaOSAgendaReclamacao = await database.simpleExecute
                                            (createSqlOsAgendaReclamacao, 
                                              [ 
                                                NEWOSAGENDA.RECLAMACAO,
                                                NEWOSAGENDA.COD_EMPRESA,
                                                NumeroAgenda                                                
                                              ]
                                              , { autoCommit: true });  
                                              
  const TabelaOSAgendaServico = await database.simpleExecute
                                            (createSqlOsAgendaServico, 
                                              [  
                                                NEWOSAGENDA.COD_EMPRESA,
                                                NumeroAgenda,     
                                                NEWOSAGENDA.COD_SERVICO, 
                                                NEWOSAGENDA.PRISMA,
                                                NEWOSAGENDA.DATA_AGENDADA,
                                                NEWOSAGENDA.DATA_PREVISAO_FIM,
                                                SERVICO.TEMPO_PADRAO,
                                                SERVICO.TEMPO_PADRAO
                                              ]
                                              , { autoCommit: true }); 
                                               

}

async function getBox() {
  const SqlNumeracaoOSAgenda = `select count(*) qtde  from "`+schemaUsuario+`".prisma_box  where prisma=:PRISMA and cod_empresa_filtro=:COD_EMPRESA`
  const result   = await database.simpleExecute(SqlNumeracaoOSAgenda, [NEWOSAGENDA.PRISMA,NEWOSAGENDA.COD_EMPRESA])  
  const valor = result.rows[0]['QTDE']
  console.log('validar Box: '+valor)
  if (valor == 0) {    
    arrayErrosValidacao.push({"msg":"Box nao existe","param":"PRISMA","location":"Base Cliente"})
  } else {       
  }   
 }
 
async function getUsuario() {
  const SqlNumeracaoOSAgenda = `select count(*) qtde  from "`+schemaUsuario+`".empresas_usuarios eu where eu.nome=:NOME`
  const result   = await database.simpleExecute(SqlNumeracaoOSAgenda, [NEWOSAGENDA.CONSULTOR])  
  const valor = result.rows[0]['QTDE']
  console.log('validar Usuario: '+valor)
  if (valor == 0) {    
   arrayErrosValidacao.push({"msg":"Consultor/Usuario nao existe","param":"CONSULTOR","location":"Base Cliente"})
   
  } else {    
   
  }   
 }
 
 async function getPlaca() {
	 
  const SqlPlaca = `select odv.placa 
          from "`+schemaUsuario+`".os_dados_veiculos odv,os
					where odv.cod_empresa=os.cod_empresa
					and   odv.numero_os=os.numero_os
					and  chassi=:CHASSI
					order by data_emissao desc` 
					
  const result   = await database.simpleExecute(SqlPlaca, [NEWOSAGENDA.CHASSI])   

  if (result.rows[0] && NEWOSAGENDA.PLACA == 'NAO0000'){
   
      var placaAtual = result.rows[0]['PLACA']
         console.log(placaAtual)
        return placaAtual
     
    }else{
      console.log('nao achou placa')  
      if (NEWOSAGENDA.PLACA == 'NAO0000'){
        return ''
      }else{
        return NEWOSAGENDA.PLACA 
      }
      
    }
    
       
 }

 async function getEmpresa() {
  const sqlEmpresas = `select count(*) qtde  from "`+schemaUsuario+`".empresas where cod_empresa=:COD_EMPRESA`
  const result   = await database.simpleExecute(sqlEmpresas, [NEWOSAGENDA.COD_EMPRESA])  
  const valor = result.rows[0]['QTDE']
  console.log('validar Empresa: '+valor)
  if (valor == 0) {       
   arrayErrosValidacao.push({"msg":"Codigo da empresa nao existe","param":"COD_EMPRESA","location":"Base Cliente"})
  } else {    
   return 'OK'
  }   
 }

 async function getProdutoModelo() {
  const sqlEmpresas = `select count(*) qtde  from "`+schemaUsuario+`".produtos_modelos where cod_produto=:COD_PRODUTO and cod_modelo=:COD_MODELO`
  const result   = await database.simpleExecute(sqlEmpresas, [NEWOSAGENDA.COD_PRODUTO,NEWOSAGENDA.COD_MODELO])  
  const valor = result.rows[0]['QTDE']
  console.log('validar Produto e Modelo: '+valor)
  if (valor == 0) {       
   arrayErrosValidacao.push({"msg":"Produto/Modelo não existem na base","param":"COD_PRODUTO E COD_MODELO","location":"Base Cliente"})
  } else {    
   
  }   
 }

 async function getServicos() {  
  const sqlEmpresas = `select cod_servico,tempo_padrao,preco_venda,preco_custo  from "`+schemaUsuario+`".servicos where cod_servico=:COD_SERVICO`
  const result   = await database.simpleExecute(sqlEmpresas, [NEWOSAGENDA.COD_SERVICO])   
  console.log(result.rows)
  if (result.rows == 0) {       
   arrayErrosValidacao.push({"msg":"codigo do servico nao encontrado","param":"COD_SERVICO","location":"Base Cliente"})
  } else {    
   return result.rows[0]
  }   
 }
 
  if (arrayErrosValidacao.length == 0  ){
    await gravarAgenda()
    return (''+NumeroAgenda);
  }else{
    return arrayErrosValidacao
  }   
  }

module.exports.create = create;




  async function del(context) { 
  let  schemaUsuario = context.SCHEMA;
  cod_agenda = context.COD_AGENDAMENTO;

 const deleteSql =  `delete from "`+schemaUsuario+`".os_agenda og
    where og.cod_os_agenda = :COD_AGENDAMENTO    
    `;

 const deleteAgendaReclamacaopSql =
  `delete from "`+schemaUsuario+`".OS_AGENDA_RECLAMACAO ogr
  where ogr.cod_os_agenda = :COD_AGENDAMENTO`;

  const deleteChipSql =
  `delete from "`+schemaUsuario+`".OS_AGENDA_SERVICOS ogs
  where ogs.cod_os_agenda = :COD_AGENDAMENTO
  `;
     

    const chip    = await database.simpleExecute(deleteChipSql, [cod_agenda], { autoCommit: true });    
    const Ogr     = await database.simpleExecute(deleteAgendaReclamacaopSql, [cod_agenda], { autoCommit: true });
    const result  = await database.simpleExecute(deleteSql, [cod_agenda], { autoCommit: true });
    
 
    return context.COD_AGENDAMENTO ;
  }
   

module.exports.delete = del;
