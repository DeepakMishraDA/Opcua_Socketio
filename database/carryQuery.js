const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const uuid = require('uuid');
console.log(`Here is a test v1 uuid: ${uuid.v1()}`);
console.log(`Here is a test v4 uuid: ${uuid.v4()}`);
//(
async function carryQuery (alarmValue) {
  try {
   // console.log(alarmValue.fields)
    // console.log("::1",alarm.fields.activeState.value.text);
    // console.log("::2",alarm.fields.conditionId.value.value)
   // const activeState = alarm.fields.activeState.value.text == 'Active';
    // user = {
    //   id: alarm.fields.activeState.value.text,
    //   node: alarm.fields.conditionId.value.value
    // }
    const user = await prisma.alarms.create({
      data:{
        id: uuid.v4(),
        node: alarmValue.fields.conditionId.value.value,
        alarm_text:  alarmValue.fields.message.value.text.toString('base64'),
        severity:  alarmValue.fields.severity.value,
        raised_time: alarmValue.fields.receiveTime.value.getTime()/1000,

      },
    })
    console.log("this is inserted::::",user)
    // const query = `Insert Into "alarms" (id,node)
    // Values (${uuid.v4()}, ${alarm.fields.conditionId.value.value})`;
    //const result = await prisma.$executeRawUnsafe(`Insert Into public.alarms (id,node)
    //Values (${uuid.v4()}, ${alarm.fields.conditionId.value.value})`)
    //const result = await prisma.$queryRaw`${query}`;
    //console.log(result)
    console.log('Successful!!');
  } catch(e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
} //)();

module.exports = carryQuery;