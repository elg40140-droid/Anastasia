/**
 * 🎯 أمر: بث رسالة لجميع المجموعات
 * 📍 الصلاحيات: المالك فقط
 * 🌐 الوظيفة: إرسال رسالة لجميع مجموعات البوت
 * 🎪 الفئة: مالك
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

let handler=async(m,{conn,isROwner,text,tr})=>{
const delay=(time)=>new Promise((res)=>setTimeout(res,time))
const getGroups=await conn.groupFetchAllParticipating()
const groups=Object.entries(getGroups).slice(0).map((entry)=>entry[1])
const anu=groups.map((v)=>v.id)
const pesan=m.quoted&&m.quoted.text?m.quoted.text:text
if(!pesan)throw await tr(m,`يـرجـى إدخـال الـرسـالـة\n الـمـثـال: .bcgc رسالة\n أو: اقتبس رسالة واكتب .bcgc`)

m.reply(await tr(m,`جـارٍ إرسـال الـرسـالـة\n عـدد الـمـجـمـوعـات: ${anu.length}\n الـرسـالـة: ${pesan.slice(0,50)}...\n يـرجـى الـانـتـظـار...`))

let successCount=0
let failCount=0

for(const i of anu){
await delay(500)
conn.relayMessage(i,
{liveLocationMessage:{
degreesLatitude:35.685506276233525,
degreesLongitude:139.75270667105852,
accuracyInMeters:0,
degreesClockwiseFromMagneticNorth:2,
caption:`إعـلان مـهـم\n${pesan}\n🎀 كـاتـي بـوت`,
sequenceNumber:2,
timeOffset:3,
contextInfo:m,
}},{}).then(()=>{
successCount++
}).catch((_)=>{
failCount++
})
}

m.reply(await tr(m,`تـم الـبـث بـنـجـاح\n عـدد الـمـجـمـوعـات: ${anu.length}\n الـنـاجـح: ${successCount}\n الـفـاشـل: ${failCount}\n نـسـبـة الـنـجـاح: ${((successCount/anu.length)*100).toFixed(1)}%`))
}
handler.help=['bcgc <نص> - بث رسالة لجميع المجموعات']
handler.tags=['مالك']
handler.command=['bcgc','بث']
handler.owner=true

export default handler