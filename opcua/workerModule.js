const { Worker } = require('worker_threads');
const { sql } = require('@databases/pg');

const endpointUrl1 = 'opc.tcp://10.1.3.178:4840';
const query1 = sql`SELECT opc,node_id FROM gfcdb.sensor s 
JOIN gfcdb.building ON building.id = s.building
WHERE building = 1;`;
const endpointUrl2 = 'opc.tcp://10.3.3.20:4840';
const query2 = sql`SELECT opc,node_id FROM gfcdb.sensor s 
JOIN gfcdb.building ON building.id = s.building
WHERE building = 3;`;
const query3 = sql`SELECT ARRAY_AGG(node_id),opc FROM gfcdb.sensor s 
JOIN gfcdb.building ON building.id = s.building
WHERE opc_bridge_id = 1 
 AND opc is not Null 
 And s.monthly = false
 AND  s.periodic = false
 GROUP BY opc;`;
const paramsArray = [{ parOne: endpointUrl1, paraTwo: query3 }]
//{ parOne: endpointUrl2, paraTwo: query2 }];
// const paramsObj1 = { parOne: endpointUrl1, paraTwo: query1 };
// const paramsObj2 = { parOne: endpointUrl2, paraTwo: query2 };
// const worker1 = new Worker(`
// const { parentPort } = require('./nodeBrowsers');
// `, { eval: true });
// worker1.on('message', message => console.log(":::",message));      
// worker1.postMessage(paramsObj1);  
// const worker2 = new Worker(`
// const { parentPort } = require('./nodeBrowsers');
// `, { eval: true });
// worker2.on('message', message => console.log(":::",message));      
// worker2.postMessage(paramsObj2);
// const query3 = sql`SELECT building AS b FROM gfcdb.sensor s 
// JOIN gfcdb.building ON building.id = s.building
// WHERE opc_bridge_id = 1 
//  AND opc is not Null 
//  And s.monthly = false
//  AND  s.periodic = false --for np>>false
// GROUP BY opc, building;`;
// const paramsArray = []
// run1(query3).then(data=>{
//     data.map(b => {
//         paramsArray.push({ paraTwo:b.b})});
//     console.log("::;",paramsArray);
//     paramsArray.map((param) => {
//         const worker = new Worker(`
//         const { parentPort } = require('./nodeBrowsers');
//         `, { eval: true });
//         worker.on('message', message => console.log(":::",message));      
//         worker.postMessage(param); 
// });
// })

paramsArray.map((param) => {
        const worker = new Worker(`
        const { parentPort } = require('./nodeBrowsers');
        `, { eval: true });
        worker.on('message', message => console.log(":::",message));      
        worker.postMessage(param); 
});

