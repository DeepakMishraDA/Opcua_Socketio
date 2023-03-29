// const { OPCUAClient } = require('node-opcua');
// const opcua = require("node-opcua");
// //import isUUID from 'validator/lib/isUUID';
// const createConnectionPool = require('@databases/pg');
const { sql } = require('@databases/pg');
const { parentPort } = require('node:worker_threads');
require('dotenv').config();
const { Worker } = require('worker_threads');

const makeSession = require('./makeSession');
const run1 = require('./run1');
const run2 = require('./run2');


// function getChildrenNodes(browseNode) {
//   const childrenRefs = browseNode.references.filter(
//     value => value.referenceTypeId.value == 47,
//   );
//   return childrenRefs;
// }

// export function convertToCSV(arr) {
//   const array = [Object.keys(arr[0])].concat(arr);

//   return array
//     .map(it => {
//       return Object.values(it).toString();
//     })
//     .join('\n');
// }



async function getValues(params){
  //const query = sql`SELECT node_id FROM gfcdb.sensor WHERE building = 1;`
  //const url = params.paraOne;
  const query = params.paraTwo;
  //console.log(params)
  const result = await run1(query);
  //console.log(result)
  const { session,client }  = await makeSession(result[0].opc);
  //const nodeId = 'ns=4;s=PRG_HK1.FB_PID.rIN_Solltemperatur';
  for (const nid in result) {
      console.log(result[nid]);
        // let nodeId = result[nid].node_id;
        // const browseData = await session.read({ nodeId });
      
        // console.log(`${nid} DATA of ${result[0].building} which's ${nodeId} is ${browseData.value.value})`);
        //console.log("DATA:",nsArray);
        //const qury = sql`INSERT INTO public.orders (username) Values (${browseData.value.value})`;
        //await run2(qury);
        // result.forEach(async item => {
        //     //const nodeId = 'ns=2;s=IDS.Datapoints.Modbus.mdbDev1.mdbDp73';
        //     const browseData = await session.read({ item });
        //     //const nsArray = await session.readNamespaceArray();
        //     console.log("DATA:",browseData.value);
        // });
        //console.log(`DATA's ${nodeId} and ${browseData.value.value}`);

  }
  session.close(() => {
    console.log("Session closed");
  })
  client.disconnect();
}



const endpointUrl1 = 'opc.tcp://10.1.3.178:4840';
const endpointUrl2 = 'opc.tcp://10.3.3.20:4840';
const query1 = sql`SELECT opc,node_id,building FROM gfcdb.sensor s 
JOIN gfcdb.building ON building.id = s.building
WHERE building = 1;`;
const query2 = sql`SELECT opc,node_id,building FROM gfcdb.sensor s 
JOIN gfcdb.building ON building.id = s.building
WHERE building = 3;`
const query3 = sql`SELECT ARRAY_AGG(node_id),opc FROM gfcdb.sensor s 
JOIN gfcdb.building ON building.id = s.building
WHERE opc_bridge_id = 1 
 AND opc is not Null 
 And s.monthly = false
 AND  s.periodic = false
 GROUP BY opc;`;
const paramsArray = [{ parOne: endpointUrl1, paraTwo: query3 }]
// { parOne: endpointUrl2, paraTwo: query2 }];
// const paramsArray2 = { parOne: endpointUrl2, paraTwo: query2 };
// const paramsArray1 = { parOne: endpointUrl1, paraTwo: query1 };
// getValues(paramsArray1).then(data=>{
//   return
// }
// );

// getValues(paramsArray2).then(data=>{
//   return
// }
// )
paramsArray.map(async param => {
  await getValues(param).then(data=>{
    return;
  }
  )
});
// const query3 = sql`SELECT building AS b FROM gfcdb.sensor s 
// JOIN gfcdb.building ON building.id = s.building
// WHERE opc_bridge_id = 1 
//  AND opc is not Null 
//  And s.monthly = false
//  AND  s.periodic = false --for np>>false
// GROUP BY opc, building;`;
// const paramsArray = [];
// run1(query3).then(data=>{
//     data.map(b => {
//         paramsArray.push({ paraTwo:b.b})});
//     paramsArray.map(async param => {
//       console.log("::;",param);
//       await getValues(param).then(data=>{
//         return
//       }
//       )
//     });
// })

// parentPort.on('message',(params) => {
//   console.log(params)
//   //console.log(getValues(params))
// })
// const endpointUrl1 = 'opc.tcp://10.1.3.178:4840';
// const endpointUrl2 = 'opc.tcp://10.3.3.20:4840';
// const query1 = sql`SELECT node_id FROM gfcdb.sensor WHERE building = 1;`;
// const query2 = sql`SELECT node_id FROM gfcdb.sensor WHERE building = 3;`;

//module.exports = getValues;
// getValues({query:query1,url:endpointUrl1}).then(data => {
//   return;
// });

// getValues({query:query2,url:endpointUrl2}).then(data => {
//   return;
// })




// await makeSession();
//   .then(async ({session,client}) => {
//     //const nodeId = 'ns=2;s=IDS.Datapoints.Modbus.mdbDev1.mdbDp73';
//     const browseData = await session.read({ item });
//     //const nsArray = await session.readNamespaceArray();
//     console.log("DATA:",browseData.value);

//   const browseOptions = {
//     nodeId: 'i=2553[Server]', // start browsing from the root folder of the server
//     referenceTypeId: opcua.resolveNodeId("Organizes"), // only browse nodes that are organized by the server
//     includeSubtypes: true, // browse all subtypes of the reference type
//     browseDirection: opcua.BrowseDirection.Forward, // browse in the forward direction
//     resultMask: opcua.makeResultMask("ReferenceType | IsForward | BrowseName | NodeClass | TypeDefinition") // include the desired node attributes in the results
// };
 //ns=2;s=IDS.Datapoints.Modbus.mdbDev1
// session.browse('ns=2;s=IDS.Datapoints.Modbus.mdbDev1', (err, browseResult) => {
//   if (err) {
//     console.log("Could not browse node:", err);
//   } else {
//     console.log("Browse result:", Object.values(browseResult)[2]);
//     // process the browse result here
//   }
// });

// TODO: get rid of this

// export async function getNodeIdCounter(
//   //res,
//   //buildingUuid,
//   nodeId,
//   session,
//   //nodeName,
// ) {
//   const browseNode = await session.browse({ nodeId });

  // const yearNodes = await Promise.all(
  //   getChildrenNodes(browseNode).map(async node => ({
  //     yearNode: await session.browse(node.nodeId),
  //     year: node.browseName.name,
  //   })),
  // );

  // const monthNodes = yearNodes.map(yearNode => ({
  //   yearNode,
  //   monthNodes: getChildrenNodes(yearNode.yearNode),
  // }));
  // const browseArray = [].concat(
  //   monthNodes[0].monthNodes,
  //   monthNodes[1].monthNodes,
  // );
  // const nodeArray = await session.browse(browseArray);
  // const splitNodeArrays = [
  //   nodeArray.slice(0, nodeArray.length / 2),
  //   nodeArray.slice(-nodeArray.length / 2),
  // ];
  // let finalNodeArray = [];
  // monthNodes.map((yearNode, yearIndex) => {
  //   yearNode.monthNodes.map((monthNode, monthIndex) => {
  //     finalNodeArray.push({
  //       nodeId: splitNodeArrays[yearIndex][monthIndex].references.filter(
  //         ref => ref.browseName.name == 'monthly_difference',
  //       )[0]?.nodeId,
  //       monthName: monthNode.browseName.name,
  //       yearName: yearNode.yearNode.year,
  //     });
  //   });
 // });
  // finalNodeArray = finalNodeArray.filter(node => node.nodeId);
  // const getNodeArray = finalNodeArray.map(node => ({ nodeId: node.nodeId }));
  // (await session.read(getNodeArray)).map((node, index) => {
  //   let value = node.value.value;
  //   value = Array.isArray(value) ? null : value;
  //   finalNodeArray[index].value = value;
  // });

  // const thisYear = new Date().getFullYear();
  // const thisMonth = new Date().getMonth() + 1;
  // const thisDay = new Date().getDate();
  // const returnData = finalNodeArray.map(nodeResults => {
  //   const monthInt = parseInt(nodeResults.monthName.slice(-2));
  //   return {
  //     counter: nodeName,
  //     month: monthInt,
  //     year:
  //       nodeResults.yearName == 'this_year'
  //         ? thisYear
  //         : nodeResults.yearName == 'last_year'
  //         ? thisYear - 1
  //         : null,
  //     value: nodeResults.value,
  //     note:
  //       monthInt == thisMonth && nodeResults.yearName == 'this_year'
  //         ? `(bis ${thisDay}.${thisMonth})`
  //         : null,
  //   };
  // });
  // returnData.sort((a, b) => {
  //   const yearDiff = a.year - b.year;
  //   if (yearDiff != 0) {
  //     return yearDiff;
  //   } else {
  //     return a.month - b.month;
  //   }
  // });
//   return returnData;
// }

// export async function counterHandler(req, res, testing = false) {
//   if (req.method === 'GET') {
//     const { buildingUuid, nodePath } = req.query;
//     if (!(nodePath && buildingUuid && isUUID(buildingUuid))) {
//       res.status(400).send('Bad Request');
//       return;
//     }
//     const nodeId = staticNodeIdMapping?.[nodePath];
//     if (nodeId == null) {
//       res.status(404).send('NodePath not found');
//     }
//     const session = await (testing ? null : makeSession());
//     const counterData = testing
//       ? [
//           { a: 1, b: 2 },
//           { a: 3, b: 4 },
//         ]
//       : await getNodeIdCounter(res, buildingUuid, nodeId, session, nodePath);
//     session ? await session.close() : null;

//     res.setHeader('content-type', 'text/csv');
//     res.setHeader(
//       'Content-Disposition',
//       `attachment; filename="${nodePath}.csv"`,
//     );
//     res.send(convertToCSV(counterData));
//     return;
//   } else {
//     res.status(405).send('Method Not Allowed');
//     return;
//   }
// }

// async function dummyCounterHandler(req, res) {
//   if (req.method === 'GET') {
//     const { buildingUuid, nodeId } = req.query;
//     if (!isUUID(buildingUuid)) {
//       res.status(400).send('Bad Request');
//       return;
//     }

//     res.setHeader('content-type', 'text/csv');
//     res.setHeader(
//       'Content-Disposition',
//       `attachment; filename="${nodeId}.csv"`,
//     );
//     res.send('a,b,c\n1,2,3\n4,5,6');
//     res.status(200);
//     return;
//   } else {
//     res.status(405).send('Method Not Allowed');
//     return;
//   }
// }
// const nextConfig = getConfig();

// let handler = null;

// if (nextConfig?.publicRuntimeConfig.development == true) {
//   handler = dummyCounterHandler;
// } else {
//   handler = counterHandler; //TODO: find a way of safely authenticating this
// }

//export default handler;
