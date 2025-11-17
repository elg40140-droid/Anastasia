/** أمر: إرسال رسائل متعددة * الصلاحيات: الأعضاء المميزين فقط * المدخل: رقم|نص|عدد */

let handler=async(m,{conn,text,usedPrefix,command,tr})=>{
if(!text)return m.reply(await tr(m,`📤 *صـيـغـة الأمـر:*\n${usedPrefix+command} رقم|نص|عدد\n\n📌 *مـثـال:*\n${usedPrefix+command} 201234567890|مرحبا|5`))

const parts=text.split('|')
if(parts.length<2)return m.reply(await tr(m,`❌ *صـيـغـة خـاطـئـة*\n📌 يـجـب إدخـال الـرقـم والـنـص\n🎯 مـثـال: ${usedPrefix+command} 201234567890|مرحبا|5`))

const[nomor,pesan,jumlah]=parts
if(!nomor||!pesan)return m.reply(await tr(m,'❌ *يـجـب إدخـال الـرقـم والـنـص*'))

if(jumlah&&isNaN(jumlah))return m.reply(await tr(m,'❌ *يـجـب أن تـكـون الـكـمـيـة رقـمـاً صـحـيـحـاً*'))

const fixedNumber=nomor.replace(/[-+<>@]/g,'').replace(/ +/g,'').replace(/^0/,'62')+'@s.whatsapp.net'
const fixedJumlah=Math.min(jumlah?parseInt(jumlah):10,30)

if(fixedJumlah>30)return m.reply(await tr(m,'❌ *الـحـد الأقـصـى 30 رسـالـة فـقـط*'))

await m.reply(await tr(m,`📤 *جـاري إرسـال ${fixedJumlah} رسـالـة...*\n⏳ رقـم الـمـسـتـلـم: ${nomor}`))

let successCount=0
let failCount=0

for(let i=0;i<fixedJumlah;i++){
try{
await conn.sendMessage(fixedNumber,{text:pesan.trim()})
successCount++
// تأخير ذكي بين الرسائل
if(i%3===0)await new Promise(resolve=>setTimeout(resolve,2000))
else await new Promise(resolve=>setTimeout(resolve,1000))
}catch(error){
failCount++
}}

const successRate=((successCount/fixedJumlah)*100).toFixed(1)
const resultText=await tr(m,`📊 *تـقـريـر الإرسـال*\n\n✅ الـرسـائـل الـمـرسـلـة: ${successCount}\n❌ الـرسـائـل الـفـاشـلـة: ${failCount}\n📞 الـرقـم الـمـسـتـلـم: ${nomor}\n🎯 نـسـبـة الـنـجـاح: ${successRate}%`)

await conn.sendMessage(m.chat,{text:resultText,contextInfo:{externalAdReply:{title:'انـــســتــازيا',body:await tr(m,'الإرسـال الـجـمـاعـي'),thumbnailUrl:global.logo,mediaType:1,renderLargerThumbnail:true}}},{quoted:m})}

handler.help=['- رقم|نص|عدد']
handler.tags=['أدوات']
handler.command=['spam','سبام']
handler.description='إرسال رسائل متعددة إلى رقم محدد'
handler.rowner=true
export default handler