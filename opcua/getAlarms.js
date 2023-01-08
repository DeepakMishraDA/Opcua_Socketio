const  { OPCUAClient } = require('node-opcua');
const alarmCaller = require('./alarmCaller');
const beforeShutdown = require('./beforeShutdown');

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
    const subscription = await session.createSubscription2({
      requestedPublishingInterval: 200,
      requestedMaxKeepAliveCount: 20,
      maxNotificationsPerPublish: 1000,
      publishingEnabled: true,
      priority: 10,
    });
    (async () => {
      console.log('closing opcua session');
      await this.session.close(true);
      await this.client.disconnect();
      console.log('opcua session closed');
    });
    return session;
  }

async function getAlarms(endpointUrl) {
  const reqSession = await opcuaSession({endpointUrl});
  console.log("jj")
    await alarmCaller(reqSession);
    
    const alarmInstance = await alarmCaller(reqSession);
    return  alarmInstance;
  }

module.exports = {getAlarms,opcuaSession} ;
