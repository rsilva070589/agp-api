const webServer = require('./services/web-server.js');
const database = require('./services/database.js');
const dbConfig = require('./config/database.js');
const axios = require('axios');
const processocorretivo  = require('./model/processocorretivo.js');

require("dotenv-safe").config();



const defaultThreadPoolSize = 4;

process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;
   
 
  // export LD_LIBRARY_PATH=/home/renato/oracle/instantclient_21_4:$LD_LIBRARY_PATH

async function startup() {
  console.log('Starting application');

  try {
    console.log('Initializing webServer');
    await webServer.initialize();
  } catch (err) {
    console.error(err);
  
    process.exit(1); // Non-zero failure code
  }

  try {
    console.log('Initializing Banco Oracle');    
    await database.initialize(); 
  } catch (err) {
    console.error(err);
  
    process.exit(1); // Non-zero failure code
  }
}

startup();


// *** previous code above this line ***

async function shutdown(e) {
  let err = e;
    
  console.log('Shutting down');

  try {
    console.log('Closing web server module');

    await webServer.close(); 
  } catch (e) {
    console.log('Encountered error', e);

    err = err || e;
  }

  try {
    console.log('Closing database module');
 
    await database.close(); 
  } catch (err) {
    console.log('Encountered error', e);
 
    err = err || e;
  }

  console.log('Exiting process');

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');

  shutdown();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT');

  shutdown();
});

process.on('uncaughtException', err => {
  console.log('Uncaught exception');
  console.error(err);

  shutdown(err);
});

function procedureTime() {
 
  processocorretivo.find()
}

//setInterval(procedureTime,3600000)
 

 

 
