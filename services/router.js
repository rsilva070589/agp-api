const express    = require('express');
const router     = new express.Router('express-promise-router');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const { body, validationResult, param} = require('express-validator'); 
const metadata = require('gcp-metadata');
const {OAuth2Client} = require('google-auth-library');
 
const oAuth2Client = new OAuth2Client();
const clientes   = require('../controllers/clientes.js');
const modelos    = require('../controllers/modelos.js');
const servicos   = require('../controllers/servicos.js');
const tecnicos   = require('../controllers/tecnicos.js');
const cidades    = require('../controllers/cidades.js');
const frota      = require('../controllers/frota.js');
const agenda     = require('../controllers/agenda.js');
const os         = require('../controllers/os.js');
const empresas   = require('../controllers/empresas.js'); 
const usuarios   = require('../controllers/usuarios.js'); 
const comissao   = require('../controllers/comissaoanalitica.js'); 
const comissaoresumo = require('../controllers/comissaoresumo.js'); 
const comissaocalculada = require('../controllers/comissaocalculada.js'); 
const regracomissao   = require('../controllers/regracomissao.js'); 
const constraint  = require('../controllers/constraint.js');
const checkpoint  = require('../controllers/checkpoint.js');
const facil       = require('../controllers/comissaofacil.js');
const integracao  = require('../controllers/integracao.js');
const integracaoNew  = require('../controllers/integracaoNew.js');

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
 
 
//authentication
router.route('/login')
.post((req, res, next) => {
  if(req.body.USER === 'integracao@grupoagp.com.br' && req.body.PASSWORD === '@asdfnk#'){
    //auth ok
    const id = 1; 
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300 // expires in 5min
    });
    return res.json({ auth: true, token: token });
  }
  
  res.status(500).json({message: 'Login inválido!'});
})

function verifyJWT(req, res, next){
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
  console.log(req.headers['authorization'])
  console.log(process.env.SECRET)
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}


router.route('/integracao/',)
.post(verifyJWT,
  [
    body("CPF").isInt().withMessage("Informe CPF"),
    body("CPF").isLength({ min: 11, max: 11 }).withMessage("CPF precisa ter 11 digitos sem traços ou pontos"),
    body("MES").notEmpty().withMessage("Informe Mês ex: MM/YYYY"), 
  ],
   (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,integracao.get
  )


 
router.route('/comissao/',)
.post(
  [
    body("CPF").isInt().withMessage("Informe CPF"),
    body("CPF").isLength({ min: 11, max: 11 }).withMessage("CPF precisa ter 11 digitos sem traços ou pontos"),
    body("MES").notEmpty().withMessage("Informe Mês ex: MM/YYYY"), 
  ],
   (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,integracao.get
  )

  router.route('/newcomissao/',)
.post(
  [
    body("CPF").isInt().withMessage("Informe CPF"),
    body("CPF").isLength({ min: 11, max: 11 }).withMessage("CPF precisa ter 11 digitos sem traços ou pontos"),
    body("MES").notEmpty().withMessage("Informe Mês ex: MM/YYYY"), 
  ],
   (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,integracaoNew.get
  )
 

router.route('/constraint/:id?')
.get(constraint.get);    


router.route('/modelos/:id?')
.get(modelos.get);    

router.route('/servicos/:id?')
.get(servicos.get);     
 
router.route('/tecnicos/:id?')
.get(tecnicos.get);    

router.route('/cidades/:id?')
.get(cidades.get);

router.route('/empresas/:id?')
.get(empresas.get);

router.route('/usuarios/:MES?')
.get(usuarios.get)
.put(usuarios.put)
.delete(usuarios.delete)
.post(
  [
    body("COD_EMPRESA").isInt().withMessage("Informe o Codigo da Empresa"),
    body("FUNCAO").notEmpty().withMessage("Informe FUNCAO"),
    body("COD_FUNCAO").notEmpty().withMessage("Informe COD_FUNCAO"),
    body("NOME").notEmpty().withMessage("Informe o NOME LOGIN"),
    body("NOME_COMPLETO").notEmpty().withMessage("Informe o NOME_COMPLETO"),
    body("MES").notEmpty().withMessage("Informe o MES")
  ],
  (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,usuarios.post
  );

 

router.route('/calculada/:MES?:MARCA?')
.get(comissaocalculada.get);
 
router.route('/facil/:MES?')
.get(facil.get)
.put(facil.put)
.delete(facil.delete)
.post(
  [
    body("COD_EMPRESA").notEmpty().withMessage("Informe o Codigo da COD_EMPRESA"), 
    body("VENDEDOR").notEmpty().withMessage("Informe o  VENDEDOR"),   
    body("TIPO").notEmpty().withMessage("Informe o  TIPO"),
    body("COD_CLIENTE").notEmpty().withMessage("Informe o  COD_CLIENTE"),
    body("VALOR").notEmpty().withMessage("Informe o VALOR"),
    body("REGISTRO").notEmpty().withMessage("Informe o REGISTRO"),
  ],
  (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,facil.post
  );


router.route('/regracomissao/:id?')
.get(regracomissao.get)
.put(regracomissao.put)
.delete(regracomissao.delete)
.post(
  [
    body("COD_EMPRESA").isInt().withMessage("Informe o Codigo da Empresa"),
    body("TIPO_COMISSAO").notEmpty().withMessage("Informe o TIPO de Comissao"),
    body("MES").notEmpty().withMessage("Informe o MES")
  ],
  (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,regracomissao.post
  );

router.route('/checkpoint/:id?')
.get(checkpoint.get);

router.route('/checkpoint/:id?')
.get(frota.get); 

router.route('/agenda/:id?')
.get(agenda.get)
.delete(agenda.delete)
.post(
  [
    body("COD_EMPRESA").isInt().withMessage("Informe o Codigo da Empresa"),
    body("PRISMA").notEmpty().withMessage("Informe o Prisma"),
    body("COD_CLIENTE").isLength({ min: 8, max: 14 }).withMessage("CPF ou CNPJ Precisa ter 11 OU 14 digitos!"),
    body("COD_PRODUTO").notEmpty().withMessage("Informe o Cod Produto"),
    body("COD_MODELO").notEmpty().withMessage("Informe o Cod Modelo"),
    body("COR_EXTERNA").notEmpty().withMessage("Informe a Cor do Veiculo"), 
    body("CHASSI").isLength({ min: 17, max: 17 }).withMessage("o Chassi deve conter 17 digitos"),
    body("PLACA").isLength({ min: 7, max: 9 }).withMessage("Informe uma Placa Valida"),
    body("KM").isInt().withMessage("Informe o KM do Cliente"),
    body("RECLAMACAO").isLength({ min: 1, max: 99 }).withMessage("Informe o Reparo para o veiculo"),
    body("CONSULTOR").isLength({ min: 3, max: 10 }).withMessage("O campo CONSULTOR deve existir um LOGIN no NBS. min 3 e max 10"),
     //body("DATA_AGENDADA").isISO8601('dd/mm/yyyy').isDate().withMessage("Informe uma data de agendamento!"),
    body("DATA_AGENDADA").notEmpty().withMessage("Data do agendamento invalida"),
    body("DATA_PREVISAO_FIM").notEmpty().withMessage("Data previsao invalida"),
    body("DATA_PROMETIDA").notEmpty().withMessage("Data prometida invalida"), 
 
  ],
  (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,agenda.post
  );

router.route('/os/:id?')
.get(os.get)
.post(
  [
   body("COD_CLIENTE").isLength({ min: 11, max: 11 }).withMessage("CPF Precisa ter 11 digitos!"),
   body("COD_EMPRESA").isInt().withMessage("Informe o Codigo da Empresa"),
   body("TIPO").isLength({ min: 2, max: 2 }).withMessage("Tipo de OS precisa ser 2 digitos"),
   body("CHASSI").isLength({ min: 17, max: 17 }).withMessage("o Chassi deve conter 17 digitos"),
   body("PLACA").isLength({ min: 8, max: 8 }).withMessage("Informe uma Placa Valida"),
   body("KM").isInt().withMessage("Informe o KM do Cliente"),
   body("RECLAMACAO").isLength({ min: 1, max: 99 }).withMessage("Informe a o Reparo para o veiculo"),
   
  ],
  (req, res, next) => {    
           const errors = validationResult(req);  
           if(!errors.isEmpty()){
             return res.status(400).json({errors: errors.array()});
           }  
           return next();
          }
   ,os.post
  );
 

router.route('/clientes/:id?')
.get(clientes.get)
.put(clientes.put) 
.post(
      [body("ENDERECO_ELETRONICO").isEmail().withMessage("Precisa ser um Email Valido!"),
       body("COD_CLIENTE").isLength({ min: 11, max: 14 }).withMessage("CPF ou CNPJ Precisa ter entre 11 e 14 digitos!"),
       body("NOME").isLength({ min: 3, max: 50 }).withMessage("Valor Maximo do Nome e 50 caracteres"),
       body("RUA_RES").isLength({ min: 3, max: 50 }).withMessage("Valor Maximo do Rua e 30 caracteres"),
       body("FACHADA_RES").isInt().withMessage("Digite um Numero Inteiro"),
       body("COMPLEMENTO_RES").isLength({ min: 0, max: 20 }).withMessage("Valor Maximo do Complemeto e 20 caracteres"),
       body("TELEFONE_CEL").isLength({ min: 8, max: 9 }).withMessage("Infome um telefone Valido"),
      ],
      (req, res, next) => {    
               const errors = validationResult(req);  
               if(!errors.isEmpty()){
                 return res.status(400).json({errors: errors.array()});
               }  
               return next();
              }
       ,clientes.post
      ); 
    
  ;


module.exports = router;
