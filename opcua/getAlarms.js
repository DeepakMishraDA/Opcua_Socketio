const  { OPCUAClient } = require('node-opcua');
const alarmCaller = require('./alarmCaller1');
const beforeShutdown = require('../helpers/beforeShutdown');

  async function opcuaSession({ endpointUrl }) {
    const client = OPCUAClient.create({
      endpointMustExist: false,
    });
     client.on('backoff', (retry, delay) => {
      console.log('Retrying to connect to ', endpointUrl, ' attempt ', retry);
    });
     client.on('abort', () => {
      process.exit(0);
    });
     client.on('connection_lost', () => {
      process.exit(0);
    });
     client.on('timed_out_request', () => {
      process.exit(0);
    });
    console.log('connecting to endpoint');
    if (endpointUrl) {
      await client.connect(endpointUrl);
    }
    console.log('connected to OpcServer now!');
    const session = await client.createSession();
    //await session.close(true);
    console.log('closing opcua session');
    // const session = await client.createSession();
    // const subscription = await session.createSubscription2({
    //   requestedPublishingInterval: 200,
    //   requestedMaxKeepAliveCount: 20,
    //   maxNotificationsPerPublish: 1000,
    //   publishingEnabled: true,
    //   priority: 10,
    // });
    // await session.close(true);
    async function onShutdown() {
      await session.close(true);
      console.log('opc server closing!');
      await client.disconnect();
      console.log('Shutting down');
      console.log('Received signal to shut down.');
      // Perform any necessary cleanup here
      process.exit(0);
    }
    
    process.on('SIGINT',  async function () {
      await session.close(true);
      console.log('opc server closing!');
      await client.disconnect();
      console.log('Shutting down');
      console.log('Received signal to shut down.');
      // Perform any necessary cleanup here
      process.exit(0);
    });
    process.on('SIGTERM', async function () {
      await session.close(true);
      console.log('opc server closing!');
      await client.disconnect();
      console.log('Shutting down');
      console.log('Received signal to shut down.');
      // Perform any necessary cleanup here
      process.exit(0);
    });
    beforeShutdown(onShutdown);
      return session;
  }

async function getAlarms(endpointUrl) {
  const reqSession = await opcuaSession({endpointUrl});
  console.log("jj")
    //await alarmCaller(reqSession);
    
     const alarmInstance = await alarmCaller(reqSession);
     return  alarmInstance;
  }

module.exports = {getAlarms,opcuaSession} ;
