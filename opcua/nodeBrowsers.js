const { OPCUAClient } = require('node-opcua');
const opcua = require("node-opcua");
//import isUUID from 'validator/lib/isUUID';

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

async function makeSession() {
  const endpointUrl = 'opc.tcp://10.7.3.20:4840'; //TODO: Make a link between building Uuid and ip via Postgres
  const client = OPCUAClient.create({
    endpointMustExist: false,
    //certificateFile:
  //     '/home/ubuntu/energy-management-frontend/certificates/PKI/own/certs/certificate_2021-08-11_1628671021385.pem',
  //   privateKeyFile:
  //     '/home/ubuntu/energy-management-frontend/certificates/PKI/own/private/private_key.pem',
  //   // certificateFile: '/home/joey/credentials/certs/local_node_working.der',
  //   // privateKeyFile:
  //   //   '/home/joey/credentials/certs/certificates/PKI/own/private/private_key.pem',
  //   securityPolicy: 'http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256',
  //   securityMode: 3,
   });

  await client.connect(endpointUrl);

  const session = await client.createSession();
  return {session,client};
}
makeSession().then(async ({session,client}) => {
  const nodeId = 'ns=2;s=IDS.Datapoints.Modbus.mdbDev2.mdbDp99';
  const browseData = await session.read({ nodeId });
  const nsArray = await session.readNamespaceArray();
  //console.log("DATA:",nsArray);

  const browseOptions = {
    nodeId: 'i=2553[Server]', // start browsing from the root folder of the server
    referenceTypeId: opcua.resolveNodeId("Organizes"), // only browse nodes that are organized by the server
    includeSubtypes: true, // browse all subtypes of the reference type
    browseDirection: opcua.BrowseDirection.Forward, // browse in the forward direction
    resultMask: opcua.makeResultMask("ReferenceType | IsForward | BrowseName | NodeClass | TypeDefinition") // include the desired node attributes in the results
};
 //ns=2;s=IDS.Datapoints.Modbus.mdbDev1
session.browse('ns=2;s=IDS.Datapoints.Modbus.mdbDev1', (err, browseResult) => {
  if (err) {
    console.log("Could not browse node:", err);
  } else {
    console.log("Browse result:", Object.values(browseResult)[2]);
    // process the browse result here
  }
});
session.close(() => {
  console.log("Session closed");
})
client.disconnect();
});
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
