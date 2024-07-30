const database = require('../config/postgres.js') 

const find = (request, response) => {

    const context = {} 
    context.dataIni =     (request.body.DATAINI)
    context.dataFim =     (request.body.DATAFIM)
    context.cod_empresa = (request.body.COD_EMPRESA)
  var MES = ('01/'+request.body.MES);
  console.log(request.body)

  console.log(MES)

  let query = `  
  --select id_usuario,id_grupo,ap_usuario,nm_usuario,id_usuarioerp from syo_usuario
 -- select * from syo_evento
  SELECT 
  'EVENTOS-ATRASOS' AS TIPO,
  c.ID_EMPRESA, 
  c.ID_EVENTO, 
  c.NM_CLIENTE, 
  TO_TIMESTAMP(c.dt_horainicio / 1000) AS DATA_INICIO,
  TO_TIMESTAMP(c.dt_LIMITE / 1000) AS DATA_LIMITE,
  TO_TIMESTAMP(c.dt_proximaacao / 1000) AS proxima_acao,
  '' AS hour,
  c.ds_midia AS midia,
  c.id_statusevento,
  c.id_grupoevento,
  c.id_tipoevento,
  c.id_situacaoevento,
  c.ds_observacao,
  usu.id_usuarioerp AS vendedor,
  c.cd_usuarioalt AS alterou_evento,
  TO_TIMESTAMP(c.dt_alt / 1000) AS dt_alteracao,
  c.ds_temperatura,
  c.id_modulocriacaoevento,
  1 AS qtde,
  '0' ID_AGENDAMENTOERP,
  '' DS_FORMACONTATO
FROM syo_evento c, syo_usuario usu
WHERE TO_TIMESTAMP(c.dt_horainicio / 1000) >= TO_TIMESTAMP($1, 'DD/MM/YYYY')
AND TO_TIMESTAMP(dt_LIMITE / 1000) < CURRENT_TIMESTAMP
AND ID_EVENTO > 0
and c.id_usuario_atual = usu.id_usuario
AND id_statusevento NOT IN ('CANCELADO', 'CONCLUIDO')
AND c.id_tipoevento IN ('CONSORCIO WEB', 'CONSORCIO FONE','CONSORCIO FONE','NOVOS FONE', 'NOVOS', 'NOVOS WEB', 'SEMINOVOS', 'SEMINOVOS WEB','SEMINOVOS FONE','VENDA DIRETA WEB')
AND c.ID_EVENTO  not in 
(select a.id_evento from  syo_acao a
where a.tp_acao not in ('ENCAMINHAMENTO')
and     a.id_evento=c.id_evento
and     a.cd_usuarioinc <> 'BOT.ALICE.SYONET'
)

UNION ALL

  

SELECT 
'EVENTOS-ATENDIDOS' AS TIPO,
  CASE c.ID_EMPRESA
    WHEN 11  THEN 11   
    WHEN 12  THEN 13
    WHEN 13  THEN 14
    WHEN 14  THEN 41
    WHEN 10  THEN 20
    WHEN  1  THEN 2
    WHEN 15  THEN 30     
   else 000
 END as id_empresa, 
C.ID_EVENTO, 
'' AS NM_CLIENTE, 
TO_TIMESTAMP(c.dt_horainicio / 1000) AS DATA_INICIO,
CURRENT_TIMESTAMP AS DATA_LIMITE,
CURRENT_TIMESTAMP AS proxima_acao,
'' AS hour,
'' AS midia,
'' AS id_statusevento,
'' AS id_grupoevento,
'' AS id_tipoevento,
'' AS id_situacaoevento,
'' AS ds_observacao,
usu.id_usuarioerp AS vendedor,
'' AS alterou_evento,  -- Ajustar tipo de dados
CURRENT_TIMESTAMP AS dt_alteracao,
'' AS ds_temperatura,
'' AS id_modulocriacaoevento,
1 AS qtde,
''||C.ID_AGENDAMENTOERP,
''||C.DS_FORMACONTATO
FROM syo_evento c, syo_usuario usu
WHERE   date_part('month', TO_TIMESTAMP(c.dt_horainicio / 1000)) =  date_part('month', (SELECT current_timestamp))
AND date_part('year', TO_TIMESTAMP(c.dt_horainicio / 1000)) =  date_part('year', (SELECT current_timestamp))
AND c.ID_EVENTO > 0
AND c.id_usuario_atual = usu.id_usuario
--and usu.id_usuarioerp not in ('JPEDRO','NAGILA','JPEDRO','WILKER','ROBERTO','JOSEPH','JEFFERSOND','ERICAC','ERLANDIO','ANDRESSAJ','DIRETORIAJ','VAGNERJB','DAVIDVEND','ANACLAUDIA','JPEDRO','PEDROLU','MARCOSFER','DOGLAS','SYONET','PAULOH','WALERIA','MATHEUSRIB')
 and usu.id_usuarioerp is not null
 AND c.id_tipoevento IN ('CONSORCIO WEB', 'CONSORCIO FONE','CONSORCIO FONE','NOVOS FONE', 'NOVOS', 'NOVOS WEB', 'SEMINOVOS', 'SEMINOVOS WEB','SEMINOVOS FONE','VENDA DIRETA WEB')




union all

SELECT 
  'EVENTOS-ATRASOS-VENDEDOR' AS TIPO,
  CASE c.ID_EMPRESA
  WHEN 11  THEN 11   
  WHEN 12  THEN 13
  WHEN 13  THEN 14
  WHEN 14  THEN 41
  WHEN 10  THEN 20
  WHEN  1  THEN 2
  WHEN 15  THEN 30     
 else 000
END as id_empresa,
  0 AS ID_EVENTO, 
  '' AS NM_CLIENTE, 
  CURRENT_TIMESTAMP AS DATA_INICIO,
  CURRENT_TIMESTAMP AS DATA_LIMITE,
  CURRENT_TIMESTAMP AS proxima_acao,
  '' AS hour,
  '' AS midia,
  '' AS id_statusevento,
  '' AS id_grupoevento,
  '' AS id_tipoevento,
  '' AS id_situacaoevento,
  '' AS ds_observacao,
  usu.id_usuarioerp AS vendedor,
  '' AS alterou_evento,
  CURRENT_TIMESTAMP AS dt_alteracao,
  '' AS ds_temperatura,
  '' AS id_modulocriacaoevento,
  COUNT(*) AS qtde,
  '0' ID_AGENDAMENTOERP,
  '' DS_FORMACONTATO
FROM syo_evento c, syo_usuario usu
WHERE TO_TIMESTAMP(c.dt_horainicio / 1000) >= TO_TIMESTAMP($1, 'DD/MM/YYYY')
and c.id_usuario_atual = usu.id_usuario
AND TO_TIMESTAMP(dt_LIMITE / 1000) < CURRENT_TIMESTAMP
AND ID_EVENTO > 0
AND id_statusevento NOT IN ('CANCELADO', 'CONCLUIDO')
AND c.id_tipoevento IN ('CONSORCIO WEB', 'CONSORCIO FONE','CONSORCIO FONE','NOVOS FONE', 'NOVOS', 'NOVOS WEB', 'SEMINOVOS', 'SEMINOVOS WEB','SEMINOVOS FONE','VENDA DIRETA WEB')
AND c.ID_EVENTO  not in 

(select a.id_evento from  syo_acao a
where a.tp_acao not in ('ENCAMINHAMENTO')
and     a.id_evento=c.id_evento
and     a.cd_usuarioinc <> 'BOT.ALICE.SYONET'
)
GROUP BY usu.id_usuarioerp,   
CASE c.ID_EMPRESA
WHEN 11  THEN 11   
WHEN 12  THEN 13
WHEN 13  THEN 14
WHEN 14  THEN 41
WHEN 10  THEN 20
WHEN  1  THEN 2
WHEN 15  THEN 30     
else 000
END 


UNION ALL

SELECT 
  'EVENTOS-ATRASOS-MIDIA' AS TIPO,
  c.ID_EMPRESA, 
  0 AS ID_EVENTO, 
  '' AS NM_CLIENTE, 
  CURRENT_TIMESTAMP AS DATA_INICIO,
  CURRENT_TIMESTAMP AS DATA_LIMITE,
  CURRENT_TIMESTAMP AS proxima_acao,
  '' AS hour,
  ds_midia AS midia,
  '' AS id_statusevento,
  '' AS id_grupoevento,
  '' AS id_tipoevento,
  '' AS id_situacaoevento,
  '' AS ds_observacao,
  '' AS criou_evento,
  '' AS alterou_evento,
  CURRENT_TIMESTAMP AS dt_alteracao,
  '' AS ds_temperatura,
  '' AS id_modulocriacaoevento,
  COUNT(*) AS qtde,
  '0' ID_AGENDAMENTOERP,
  '' DS_FORMACONTATO
FROM syo_evento c, syo_usuario usu
WHERE TO_TIMESTAMP(c.dt_horainicio / 1000) >= TO_TIMESTAMP($1, 'DD/MM/YYYY')
and c.id_usuario_atual = usu.id_usuario
AND TO_TIMESTAMP(dt_LIMITE / 1000) < CURRENT_TIMESTAMP
AND id_statusevento NOT IN ('CANCELADO', 'CONCLUIDO')
AND c.id_tipoevento IN ('CONSORCIO WEB', 'CONSORCIO FONE','CONSORCIO FONE','NOVOS FONE', 'NOVOS', 'NOVOS WEB', 'SEMINOVOS', 'SEMINOVOS WEB','SEMINOVOS FONE','VENDA DIRETA WEB')
and ds_midia is not null
AND ID_EVENTO > 0
GROUP BY  c.ID_EMPRESA,ds_midia  

UNION ALL


SELECT  

  'EVENTOS-ATRASOS-VENDEDOR-DIAS' AS TIPO,
  c.ID_EMPRESA, 
  0 AS ID_EVENTO, 
  '' AS NM_CLIENTE, 
  CURRENT_TIMESTAMP AS DATA_INICIO,
  CURRENT_TIMESTAMP AS DATA_LIMITE,
  CURRENT_TIMESTAMP AS proxima_acao,
  '' AS hour,
  '' AS midia,
  '' AS id_statusevento,
  '' AS id_grupoevento,
  '' AS id_tipoevento,
  '' AS id_situacaoevento,
  '' AS ds_observacao,
  usu.id_usuarioerp AS vendedor,
  '' AS alterou_evento,
  CURRENT_TIMESTAMP AS dt_alteracao,
  '' AS ds_temperatura,
  '' AS id_modulocriacaoevento,
ROUND(
        EXTRACT(EPOCH FROM SUM(CURRENT_TIMESTAMP - TO_TIMESTAMP(dt_LIMITE / 1000))) / 86400, 1
    ) AS QTDE,
    '0' ID_AGENDAMENTOERP,
    '' DS_FORMACONTATO
FROM syo_evento c, syo_usuario usu
WHERE TO_TIMESTAMP(c.dt_horainicio / 1000) >= TO_TIMESTAMP($1, 'DD/MM/YYYY')
and c.id_usuario_atual = usu.id_usuario
AND TO_TIMESTAMP(dt_LIMITE / 1000) < CURRENT_TIMESTAMP
AND id_statusevento NOT IN ('CANCELADO', 'CONCLUIDO')
AND ID_EVENTO > 0
AND c.id_tipoevento IN ('CONSORCIO WEB', 'CONSORCIO FONE','CONSORCIO FONE','NOVOS FONE', 'NOVOS', 'NOVOS WEB', 'SEMINOVOS', 'SEMINOVOS WEB','SEMINOVOS FONE','VENDA DIRETA WEB')
GROUP BY   usu.id_usuarioerp,c.ID_EMPRESA

UNION ALL


SELECT 
'EVENTOS-AGUARDANDO' AS TIPO,
  CASE c.ID_EMPRESA
      WHEN 11  THEN 11   
      WHEN 12  THEN 13
      WHEN 13  THEN 14
      WHEN 14  THEN 41
      WHEN 10  THEN 20
      WHEN  1  THEN 2
      WHEN 15  THEN 30     
     else 000
   END as id_empresa,
c.ID_EVENTO, 
c.NM_CLIENTE, 
TO_TIMESTAMP(dt_horainicio / 1000) AS DATA_INICIO,
TO_TIMESTAMP(dt_LIMITE / 1000) AS DATA_LIMITE,
TO_TIMESTAMP(dt_proximaacao / 1000) AS proxima_acao,
'' AS hour,
ds_midia AS midia,
id_statusevento,
id_grupoevento,
id_tipoevento,
id_situacaoevento,
ds_observacao,
    CASE 
        WHEN usu.id_usuarioerp = 'WILKER14' THEN 'NEXTIP'        
        ELSE usu.id_usuarioerp
    END AS vendedor,
c.cd_usuarioalt AS alterou_evento,
TO_TIMESTAMP(c.dt_alt / 1000) AS dt_alteracao,
ds_temperatura,
id_modulocriacaoevento,
ROUND(
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - TO_TIMESTAMP(dt_LIMITE / 1000))) / 86400, 1
    ) AS QTDE,
    '0' ID_AGENDAMENTOERP,
    '' DS_FORMACONTATO

FROM syo_evento c, syo_usuario usu
WHERE
-- TO_TIMESTAMP(c.dt_horainicio / 1000) >= TO_TIMESTAMP($1, 'DD/MM/YYYY')
 c.id_usuario_atual = usu.id_usuario
AND TO_TIMESTAMP(dt_LIMITE / 1000) < CURRENT_TIMESTAMP
AND ID_EVENTO > 0
 AND id_statusevento IN ('AGUARDANDO')
AND c.id_tipoevento IN ('CONSORCIO WEB', 'CONSORCIO FONE','CONSORCIO FONE','NOVOS FONE', 'NOVOS', 'NOVOS WEB', 'SEMINOVOS', 'SEMINOVOS WEB','SEMINOVOS FONE','VENDA DIRETA WEB')
--AND c.ID_EVENTO not in (select a.id_evento from syo_acao a where a.id_evento = c.id_evento  and   a.tp_acao not in ('ENCAMINHAMENTO')
--and  c.ID_EVENTO   = 236552

union all
 
SELECT 
  'ACOES-POR-HORA' AS TIPO,
  CASE c.ID_EMPRESA
  WHEN 11  THEN 11   
  WHEN 12  THEN 13
  WHEN 13  THEN 14
  WHEN 14  THEN 41
  WHEN 10  THEN 20
  WHEN  1  THEN 2
  WHEN 15  THEN 30     
 else 000
END as id_empresa,
  0 AS ID_EVENTO, 
  '' AS NM_CLIENTE, 
  CURRENT_TIMESTAMP AS DATA_INICIO,
  CURRENT_TIMESTAMP AS DATA_LIMITE, 
  CURRENT_TIMESTAMP AS DATA_LIMITE,   
  TO_CHAR(TO_TIMESTAMP(a.dt_inc / 1000), 'HH24') AS hour,
  '' AS midia,
  '' AS id_statusevento,
  '' AS id_grupoevento,
  '' AS id_tipoevento,
  '' AS id_situacaoevento,
  '' AS ds_observacao,
  usu.id_usuarioerp AS vendedor,
  '' AS alterou_evento,
  CURRENT_TIMESTAMP AS dt_alteracao,
  '' AS ds_temperatura,
  '' AS id_modulocriacaoevento,
  COUNT(*) AS qtde,
  '0' ID_AGENDAMENTOERP,
  '' DS_FORMACONTATO
FROM syo_evento c, syo_usuario usu, syo_acao a
WHERE   DATE_TRUNC('day', TO_TIMESTAMP(a.dt_inc / 1000)) = CURRENT_DATE
and c.id_usuario_atual = usu.id_usuario
AND TO_TIMESTAMP(dt_LIMITE / 1000) < CURRENT_TIMESTAMP
AND c.ID_EVENTO > 0
and c.id_evento = a.id_evento 
and a.tp_acao not in ('ENCAMINHAMENTO')
and     a.cd_usuarioinc not in ('BOT.ALICE.SYONET','INTEGRACAO.OLX')
AND id_statusevento NOT IN ('CANCELADO', 'CONCLUIDO')
AND c.id_tipoevento IN ('CONSORCIO WEB', 'CONSORCIO FONE','CONSORCIO FONE','NOVOS FONE', 'NOVOS', 'NOVOS WEB', 'SEMINOVOS', 'SEMINOVOS WEB','SEMINOVOS FONE','VENDA DIRETA WEB')
GROUP BY usu.id_usuarioerp,   CASE c.ID_EMPRESA
WHEN 11  THEN 11   
WHEN 12  THEN 13
WHEN 13  THEN 14
WHEN 14  THEN 41
WHEN 10  THEN 20
WHEN  1  THEN 2
WHEN 15  THEN 30     
else 000 end,
TO_CHAR(TO_TIMESTAMP(a.dt_inc / 1000), 'HH24')

union all

 


SELECT  
  'EVENTOS-PERDIDOS' AS TIPO,
  CASE c.ID_EMPRESA
WHEN 11  THEN 11   
WHEN 12  THEN 13
WHEN 13  THEN 14

WHEN 14  THEN 41
WHEN 10  THEN 20
WHEN  1  THEN 2
WHEN 15  THEN 30     
else 000
END 
as id_empresa,
  c.ID_EVENTO, 
  c.NM_CLIENTE, 
  CURRENT_TIMESTAMP dt_horainicio,
  CURRENT_TIMESTAMP AS DATA_LIMITE,
  TO_TIMESTAMP( c.dt_conclusao / 1000) AS proxima_acao,
  '' AS hour,
  substring(D.ds_motivo, 30,18) AS midia,
    '' AS id_statusevento,
    c.id_grupoevento AS id_grupoevento,
    c.id_tipoevento AS id_tipoevento,
  '' AS id_situacaoevento,
  '' AS ds_observacao,
  usu.id_usuarioerp AS vendedor,
  '' AS alterou_evento,
  CURRENT_TIMESTAMP AS dt_alteracao,
  '' AS ds_temperatura,
  '' AS id_modulocriacaoevento,
1 QTDE,
'0' ID_AGENDAMENTOERP,
'' DS_FORMACONTATO
FROM syo_evento c, syo_usuario usu,syo_motivoevento d
WHERE 1=1
and  d.id_evento = c.id_evento
and  d.ds_motivo like '%INSUCESSO%'
AND DATE_TRUNC('day', TO_TIMESTAMP(C.dt_conclusao / 1000)) = CURRENT_DATE
--and   date_part('month', TO_TIMESTAMP(c.dt_horafinal / 1000)) =  date_part('month', (SELECT current_timestamp))
--and DATE_TRUNC('day', TO_TIMESTAMP(c.dt_horafinal / 1000)) = CURRENT_DATE
and c.id_usuario_atual = usu.id_usuario
AND c.id_statusevento  IN ('CONCLUIDO')
AND c.id_tipoevento IN ('CONSORCIO WEB', 'CONSORCIO FONE','CONSORCIO FONE','NOVOS FONE', 'NOVOS', 'NOVOS WEB', 'SEMINOVOS', 'SEMINOVOS WEB','SEMINOVOS FONE','VENDA DIRETA WEB')



UNION ALL

 
SELECT  
  'EVENTOS-INSUCESSO-MOTIVO' AS TIPO,
  CASE c.ID_EMPRESA
WHEN 11  THEN 11   
WHEN 12  THEN 13
WHEN 13  THEN 14

WHEN 14  THEN 41
WHEN 10  THEN 20
WHEN  1  THEN 2
WHEN 15  THEN 30     
else 000
END 
as id_empresa,
 0 ID_EVENTO, 
  '' AS NM_CLIENTE, 
  CURRENT_TIMESTAMP dt_horainicio,
  CURRENT_TIMESTAMP AS DATA_LIMITE,
  CURRENT_TIMESTAMP AS proxima_acao,
  '' AS hour,
  substring(D.ds_motivo, 30,18) AS midia,
    '' AS id_statusevento,
  '' AS id_grupoevento,
  '' AS id_tipoevento,
  '' AS id_situacaoevento,
  '' AS ds_observacao,
 ''  AS vendedor,
  '' AS alterou_evento,
  CURRENT_TIMESTAMP AS dt_alteracao,
  '' AS ds_temperatura,
  '' AS id_modulocriacaoevento,
COUNT (*) QTDE,
'0' ID_AGENDAMENTOERP,
'' DS_FORMACONTATO
FROM syo_evento c, syo_usuario usu,syo_motivoevento d
WHERE 1=1
and  d.id_evento = c.id_evento
and  d.ds_motivo like '%INSUCESSO%'
AND DATE_TRUNC('day', TO_TIMESTAMP(C.dt_conclusao / 1000)) = CURRENT_DATE
--and   date_part('month', TO_TIMESTAMP(c.dt_horafinal / 1000)) =  date_part('month', (SELECT current_timestamp))
--and DATE_TRUNC('day', TO_TIMESTAMP(c.dt_horafinal / 1000)) = CURRENT_DATE
and c.id_usuario_atual = usu.id_usuario
AND c.id_statusevento  IN ('CONCLUIDO')
AND c.id_tipoevento IN ('CONSORCIO WEB', 'CONSORCIO FONE','CONSORCIO FONE','NOVOS FONE', 'NOVOS', 'NOVOS WEB', 'SEMINOVOS', 'SEMINOVOS WEB','SEMINOVOS FONE','VENDA DIRETA WEB')
group by substring(D.ds_motivo, 30,18),
CASE c.ID_EMPRESA
        WHEN 11  THEN 11   
        WHEN 12  THEN 13
        WHEN 13  THEN 14
        WHEN 14  THEN 41
        WHEN 10  THEN 20
        WHEN  1  THEN 2
        WHEN 15  THEN 30     
        else 000
        END 


ORDER BY qtde DESC;


`
 
  database.pool.query(query,[MES], (error, results) => {
    if (error) {
      console.log(error)
      response.status(500).send(`Ocorreu um ` + error) 
    }
    if (!error)
    response.status(200).json(results.rows) 
 
  })
}

 
 
module.exports.find = find;