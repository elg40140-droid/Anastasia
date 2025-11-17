/**
 * 🎯 أمر: إعادة تشغيل البوت
 * 📍 الصلاحيات: المالك فقط
 * 🔧 الوظيفة: إعادة تشغيل نظام البوت
 * 🎪 الفئة: مالك
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

let handler=async(m,{conn,usedPrefix,command,tr})=>{
try{
await m.react('⏳')
let restartMsg=await tr(m,`جـارٍ إعـادة تـشـغـيـل الـبـوت\n الـبـوت: ${global.namebot}\n يـرجـى الانـتـظـار حـتـى يـعـود الـاتـصـال`)

await m.reply(restartMsg)
await m.react('✅')

setTimeout(()=>{
if(process.send){
process.send("restart")
}else{
process.exit(0)
}},3000)

}catch(error){
await m.react('❌')
console.error('Restart Error:',error)
let errorMsg=await tr(m,`حـدث خـطـأ فـي الإعـادة\n الـخـطـأ: ${error.message}ـ`)
conn.reply(m.chat,errorMsg,m)
}}

handler.help=['restart <إعادة_تشغيل> - إعادة تشغيل البوت']
handler.tags=['مالك']
handler.command=['restart','ريستارت']
handler.rowner=true

export default handler