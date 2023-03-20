const createConnectionPool = require('@databases/pg');// const { Client } = require('pg');
const { sql } = require('@databases/pg');
require('dotenv').config();

async function carryOutQuery({ queryString, schema }) {
  let db = null;
  try {
    db = createConnectionPool({
      connectionString: 'postgres://dmishra:V1!W2fj4MwQr@localhost:5433/postgres', //process.env.DATABASE_URL,
      schema: schema,
      bigIntMode: 'bigint',
    });
    const result = await db.query(queryString);
    await db.dispose();
    return result;
  } catch (error) {
    console.log(error);
    if (db) {
      await db.dispose();
    }
    return;
  }
};

async function sqlQueryResult() {
    const schemaOne = 'mendelstrasse';
    const queryString = sql`SELECT read_flag,relevant_flag,save_for_later_flag,
      archived_flag,node_id FROM
      mendelstrasse.alarm_type alt 
      JOIN mendelstrasse.user_alarm_interaction usi ON alt.id = usi.alarm_type_id;`;
     return await carryOutQuery({
      queryString,
      schema: schemaOne,
    });
  }
  
  async function chngToHash(){
    const results = await sqlQueryResult();
    const alarmHash = {};
    results.forEach((item) => {
      alarmHash[`${item.node_id}.rf`] = item.relevant_flag;
      alarmHash[`${item.node_id}.arch`] = item.archive;
    })
  return alarmHash
  }
  
  
  //module.exports = { sendAlarmsNotfication, queryReturn };
  

 
const alarms =  [ {
	    	"alarm_id": "ns=6;s=AlarmsConditions|CC_WP2.heat_pump_no_response",
			"location": {
				"building": "MendelstraÃe 5"
			},
			"device": "ErdwÃ¤rmepumpe, AbluftwÃ¤rmepumpe WP2",
			"severity": 2,
			"manually_fixed": false,
			"message": " ErdwÃ¤rmepumpe, AbluftwÃ¤rmepumpe WP2 | Es wurde keine Betriebsmeldung registriert.",
			"node_id": "ns=6;s=AlarmsConditions|CC_WP2.heat_pump_no_response",
			"unix_timestamp": "2023-02-07T13:59:02.675Z",
			"resolved": true,
			"read": false,
			"relevant": true,
			"unread": false,
			"save_for_later": false,
			"archive": true
		},
		{
			"alarm_id": "ns=6;s=AlarmsConditions|CC_SPL1.TRX_manual",
			"location": {
				"building": "MendelstraÃe 5"
			},
			"device": "Ladekreis, TemperaturfÃ¼hler TRL",
			"severity": 3,
			"manually_fixed": false,
			"message": " Ladekreis, TemperaturfÃ¼hler TRL | Die manuelle Vorgabe des Temperaturwerts wurde aktiviert.",
			"node_id": "ns=6;s=AlarmsConditions|CC_SPL1.TRX_manual",
			"unix_timestamp": "2023-01-26T15:56:54.665Z",
			"resolved": true,
			"read": false,
			"relevant": true,
			"unread": null,
			"save_for_later": null,
			"archive": null
		},
		{
			"alarm_id": "ns=6;s=AlarmsConditions|CC_WK.pump_manual",
			"location": {
				"building": "MendelstraÃe 5"
			},
			"device": "Weichenkreis, Pumpe PU Wk",
			"severity": 3,
			"manually_fixed": false,
			"message": " Weichenkreis, Pumpe PU Wk | Der manuelle Betrieb wurde aktiviert.",
			"node_id": "ns=6;s=AlarmsConditions|CC_WK.pump_manual",
			"unix_timestamp": "2023-01-19T15:30:13.888Z",
			"resolved": true,
			"read": false,
			"relevant": true,
			"unread": false,
			"save_for_later": null,
			"archive": true
		},
		{
			"alarm_id": "ns=6;s=AlarmsConditions|CC_QK.TRQ_manual",
			"location": {
				"building": "MendelstraÃe 5"
			},
			"device": "Quellenkreis, TemperaturfÃ¼hler TRQ",
			"severity": 3,
			"manually_fixed": false,
			"message": " Quellenkreis, TemperaturfÃ¼hler TRQ | Die manuelle Vorgabe des Temperaturwerts wurde aktiviert.",
			"node_id": "ns=6;s=AlarmsConditions|CC_QK.TRQ_manual",
			"unix_timestamp": "2023-01-19T13:22:03.398Z",
			"resolved": true,
			"read": false,
			"relevant": true,
			"unread": false,
			"save_for_later": true,
			"archive": true
		},
		{
			"alarm_id": "ns=6;s=AlarmsConditions|CC_KK.pump_manual",
			"location": {
				"building": "MendelstraÃe 5"
			},
			"device": "Kollektorkreis, Pumpe PU Sk",
			"severity": 3,
			"manually_fixed": false,
			"message": " Kollektorkreis, Pumpe PU Sk | Der manuelle Betrieb wurde aktiviert.",
			"node_id": "ns=6;s=AlarmsConditions|CC_KK.pump_manual",
			"unix_timestamp": "2023-01-19T13:20:45.413Z",
			"resolved": true,
			"read": false,
			"relevant": true,
			"unread": false,
			"save_for_later": false,
			"archive": true
		},
		{
			"alarm_id": "ns=6;s=AlarmsConditions|CC_SPL2.pump_manual",
			"location": {
				"building": "MendelstraÃe 5"
			},
			"device": "Solarer Ladekreis, Pumpe PU SPk",
			"severity": 3,
			"manually_fixed": false,
			"message": " Solarer Ladekreis, Pumpe PU SPk | Der manuelle Betrieb wurde aktiviert.",
			"node_id": "ns=6;s=AlarmsConditions|CC_SPL2.pump_manual",
			"unix_timestamp": "2023-01-19T13:20:14.782Z",
			"resolved": true,
			"read": false,
			"relevant": true,
			"unread": false,
			"save_for_later": false,
			"archive": true
		}
	];

async function queryReturn(alarms) {
        const chngHash = await chngToHash();
        alarms.forEach(element => {
            element['relevant'] = chngHash[`${element.alarm_id}.rf`]
          });
          return alarms;
      };

queryReturn(alarms).then(data => {
    console.log("{{",data)
})