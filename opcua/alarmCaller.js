/// Copied from https://github.com/node-opcua/node-opcua/blob/6efc1b90e4764d0d2c39a9c0ec03c3554b44d5c4/packages/node-opcua-client/source/alarms_and_conditions/client_alarm_tools.ts and lightly modified.

const node_opcua_data_model_1 = require('node-opcua-data-model');
const node_opcua_nodeid_1 = require('node-opcua-nodeid');
const node_opcua_service_filter_1 = require('node-opcua-service-filter');
const node_opcua_service_read_1 = require('node-opcua-service-read');
const {
  ClientMonitoredItem,
  fieldsToJson,
  ClientAlarmList,
  extractConditionFields,
  callConditionRefresh,
} = require('node-opcua-client');

function r(_key, o) {
  if (o && o.dataType === 'Null') {
    return undefined;
  }
  return o;
}

async function alarmCaller(session) {
  const _sessionPriv = session;
  // create
  if (_sessionPriv.$clientAlarmList) {
    return _sessionPriv.$clientAlarmList;
  }
  const clientAlarmList = new ClientAlarmList();
  _sessionPriv.$clientAlarmList = clientAlarmList;
  const request = {
    maxNotificationsPerPublish: 10000,
    priority: 6,
    publishingEnabled: true,
    requestedLifetimeCount: 10000,
    requestedMaxKeepAliveCount: 10,
    requestedPublishingInterval: 500,
  };
  const subscription = await session.createSubscription2(request);
  _sessionPriv.$subscriptionforAlarmList = subscription;
  const itemToMonitor = {
    attributeId: node_opcua_data_model_1.AttributeIds.EventNotifier,
    nodeId: node_opcua_nodeid_1.resolveNodeId('Server'), // i=2253
  };
  const fields = await extractConditionFields(session, 'AlarmConditionType');
  const eventFilter = node_opcua_service_filter_1.constructEventFilter(fields, [
    node_opcua_nodeid_1.resolveNodeId('AcknowledgeableConditionType'),
  ]);
  const monitoringParameters = {
    discardOldest: false,
    filter: eventFilter,
    queueSize: 10000,
    samplingInterval: 0,
  };
  // now create a event monitored Item
  const event_monitoringItem = ClientMonitoredItem.create(
    subscription,
    itemToMonitor,
    monitoringParameters,
    node_opcua_service_read_1.TimestampsToReturn.Both,
  );
  await new Promise(r => setTimeout(r, 2000));
  const RefreshStartEventType = node_opcua_nodeid_1
    .resolveNodeId('RefreshStartEventType')
    .toString();
  const RefreshEndEventType = node_opcua_nodeid_1
    .resolveNodeId('RefreshEndEventType')
    .toString();
  event_monitoringItem.on('changed', eventFields => {
    const pojo = fieldsToJson(fields, eventFields);
    try {
      if (pojo.eventType.value.toString() === RefreshStartEventType) {
        return;
      }
      if (pojo.eventType.value.toString() === RefreshEndEventType) {
        return;
      }
      if (
        !pojo.conditionId ||
        !pojo.conditionId.value ||
        pojo.conditionId.dataType === 0
      ) {
        // not a acknowledgeable condition
        return;
      }
      clientAlarmList.update(pojo);
    } catch (err) {
      // tslint:disable-next-line: no-console
      // tslint:disable-next-line: no-console
      console.log(JSON.stringify(pojo, r, ' '));
      // tslint:disable-next-line: no-console
      console.log('Error !!', err);
    }
    // Release 1.04 8 OPC Unified Architecture, Part 9
    // 4.5 Condition state synchronization
    // RefreshRequiredEventType
    // Under some circumstances a Server may not be capable of ensuring the Client is fully
    //  in sync with the current state of Condition instances. For example, if the underlying
    // system represented by the Server is reset or communications are lost for some period
    // of time the Server may need to resynchronize itself with the underlying system. In
    // these cases, the Server shall send an Event of the RefreshRequiredEventType to
    // advise the Client that a Refresh may be necessary. A Client receiving this special
    // Event should initiate a ConditionRefresh as noted in this clause.
    // TODO
  });
  try {
    await callConditionRefresh(subscription);
  } catch (err) {
    console.log('Server may not implement condition refresh', err.message);
  }
  _sessionPriv.$monitoredItemForAlarmList = event_monitoringItem;
  // also request updates
  return clientAlarmList;
}

module.exports = alarmCaller;
