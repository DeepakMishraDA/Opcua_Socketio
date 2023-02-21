const { EventEmitter } = require( "events");
const { assert } = require( "node-opcua-assert");
//const { NodeId } = require( "node-opcua-nodeid");
const { ClientAlarm } = require('node-opcua-client');;

// export interface ClientAlarmList {
//     on(eventName: "alarmChanged", handler: (alarm: ClientAlarm) => void): this;
//     // tslint:disable-next-line: unified-signatures
//     on(eventName: "newAlarm", handler: (alarm: ClientAlarm) => void): this;
// }
// maintain a set of alarm list for a client
 class ClientAlarmList extends EventEmitter {

     _map = {};

      constructor() {
        super();
    }

      [Symbol.iterator](){
        let pointer = 0;
        const components = Object.values(this._map);
        return {
            next(){
                if (pointer >= components.length) {
                    return {
                        done: true,
                        value: components[pointer++]
                    };
                } else {
                    return {
                        done: false,
                        value: components[pointer++]
                    };
                }
            }
        };
    }

      alarms(){
        return Object.values(this._map);
    }

      update(eventField) {

        // Spec says:
        // Clients shall check for multiple Event Notifications for a ConditionBranch to avoid
        // overwriting a new state delivered together with an older state = require( the Refresh
        // process.

        const { conditionId, eventType } = eventField;
        //console.log(conditionId, eventType )
        assert(conditionId, "must have a valid conditionId ( verify that event is a acknodweldgeable type");
        const alarm = this.findAlarm(conditionId.value, eventType.value);

        if (!alarm) {
            const key = this.makeKey(conditionId.value, eventType.value);
            const newAlarm = new ClientAlarm(eventField);
            this._map[key] = newAlarm;
            this.emit("newAlarm", newAlarm);
            this.emit("alarmChanged", alarm);
        } else {
            alarm.update(eventField);
            this.emit("alarmChanged", alarm);
        }
    }
      removeAlarm(eventField) {
        const { conditionId, eventType } = eventField;
        const alarm = this.findAlarm(conditionId.value, eventType.value);
        if (alarm) {
            alarm.update(eventField);
            this._removeAlarm(alarm);
        }
    }

      get length() {
        return Object.keys(this._map).length;
    }
      purgeUnusedAlarms() {
        const alarms = this.alarms();
        for (const alarm of alarms) {
            if (!alarm.getRetain()) {
                this._removeAlarm(alarm);
            }
        }
    }

     _removeAlarm(alarm) {
        this.emit("alarmDeleted", alarm);
        this.deleteAlarm(alarm.conditionId, alarm.eventType);
    }

     makeKey(conditionId, eventType) {
        return conditionId.toString() + "|" + eventType.toString();
    }
     findAlarm(conditionId, eventType) {
        const key = this.makeKey(conditionId, eventType);
        const _c = this._map[key];
        return _c || null;
    }
     deleteAlarm(conditionId, eventType) {
        const key = this.makeKey(conditionId, eventType);
        const _c = this._map[key];
        if (_c) {
            delete this._map[key];
            return true;
        }
        return false;

    }
}
module.exports = ClientAlarmList;
