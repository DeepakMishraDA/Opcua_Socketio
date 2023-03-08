const { AttributeIds } = require("node-opcua-data-model");
const { resolveNodeId } = require("node-opcua-nodeid");
const { constructEventFilter } = require("node-opcua-service-filter");
const { TimestampsToReturn } = require("node-opcua-service-read");
//const { CreateSubscriptionRequestOptions, MonitoringParametersOptions } = require("node-opcua-service-subscription");
//const { Variant } = "node-opcua-variant";
const ClientAlarmList  = require("./alarmReader");

const { ClientMonitoredItem,fieldsToJson,
callConditionRefresh,extractConditionFields} = require('node-opcua-client');

// const doDebug = checkDebugFlag(__filename);
// const debugLog = make_debugLog(__filename);

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
      requestedPublishingInterval: 500
    };
    const subscription = await session.createSubscription2(request);
    _sessionPriv.$subscriptionforAlarmList = subscription;
  
    const itemToMonitor = {
      attributeId: AttributeIds.EventNotifier,
      nodeId: resolveNodeId("Server") // i=2253
    };
  
    const fields = await extractConditionFields(session, "AlarmConditionType");
  
    const eventFilter = constructEventFilter(fields, [resolveNodeId("AcknowledgeableConditionType")]);
  
    const monitoringParameters = {
      discardOldest: false,
      filter: eventFilter,
      queueSize: 10000,
      samplingInterval: 0
    };
  
    // now create a event monitored Item
    const event_monitoringItem = ClientMonitoredItem.create(
      subscription,
      itemToMonitor,
      monitoringParameters,
      TimestampsToReturn.Both
    );
  
    const RefreshStartEventType = resolveNodeId("RefreshStartEventType").toString();
    const RefreshEndEventType = resolveNodeId("RefreshEndEventType").toString();
    await new Promise(r => setTimeout(r, 5000));
    event_monitoringItem.on('changed', (eventFields) => {
        
      //debugLog("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ---- ALARM RECEIVED");
      const pojo = fieldsToJson(fields, eventFields);
      try {
        if (pojo.eventType.value.toString() === RefreshStartEventType) {
          return;
        }
        if (pojo.eventType.value.toString() === RefreshEndEventType) {
          return;
        }
        if (!pojo.conditionId || !pojo.conditionId.value || pojo.conditionId.dataType === 0) {
          // not a acknowledgeable condition
          return;
        }
        
        clientAlarmList.update(pojo);
        //console.log("::::",tt)
      } catch (err) {
        // tslint:disable-next-line: no-console
        function r(_key, o) {
          if (o && o.dataType === "Null") {
            return undefined;
          }
          return o;
        }
        // tslint:disable-next-line: no-console
        console.log(JSON.stringify(pojo, r, " "));
        // tslint:disable-next-line: no-console
        console.log("Error !!", err);
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
      console.log("Server may not implement condition refresh", err.message);
    }
    _sessionPriv.$monitoredItemForAlarmList = event_monitoringItem;
    // also request updates
    //console.log("::",clientAlarmList)
    return clientAlarmList;
  }
  module.exports = alarmCaller;