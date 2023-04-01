const { Worker } = require('node:worker_threads');
const { parentPort} = require('node:worker_threads')
const getValues = require('./nodeBrowsers');
const { sql } = require('@databases/pg');
  // function readUpdate(parOne, paraTwo) {
  //   // Your code logic here
  // }

// Create an array of parameters to pass to the function

const endpointUrl1 = 'opc.tcp://10.1.3.178:4840';
const endpointUrl2 = 'opc.tcp://10.3.3.20:4840';
const query1 = sql`SELECT node_id FROM gfcdb.sensor WHERE building = 1;`;
const query2 = sql`SELECT node_id FROM gfcdb.sensor WHERE building = 3;`;
const paramsArray = { parOne: endpointUrl1, paraTwo: query1 };

const worker = new Worker(// Path to your function file
  './nodeBrowsers.js');
worker.postMessage(paramsArray);
 

// Create a worker thread for each set of parameters
// paramsArray.forEach(params => {
//     //const {parOne,parTwo} = params;
//     const worker = new Worker(
//      // Path to your function file
//      './nodeBrowsers.js');
//  worker.postMessage(params);
//     }
// )
  
  // worker.on('message', result => {
  //   console.log('Result:', result);
  // });
  
  // worker.on('error', error => {
  //   console.error('Error:', error);
  // });
//});

