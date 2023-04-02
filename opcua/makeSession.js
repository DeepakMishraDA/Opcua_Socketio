const { OPCUAClient } = require('node-opcua');
const opcua = require("node-opcua");

async function makeSession(endpointUrl) {
    //console.log(result)
    //const endpointUrl = 'opc.tcp://10.1.3.178:4840'; //'opc.tcp://10.7.3.20:4840'; //TODO: Make a link between building Uuid and ip via Postgres
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

module.exports = makeSession;