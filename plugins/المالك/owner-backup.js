/**
 * 🎯 أمر: النسخ الاحتياطي للبيانات
 * 📍 الصلاحيات: المالك فقط
 * 💾 المخرجات: ملفات قاعدة البيانات وجلسة البوت
 * 🎪 الفئة: مالك
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

import fs from 'fs'

let handler=async(m,{conn,usedPrefix,command,tr})=>{
try{
let loadingMsg=await tr(m,`جـارٍ إعـداد الـنـسـخ الـاحـتـيـاطـي\n نـظـام: كـاتـي بـوت\n يـرجـى الـانـتـظـار...`)

await m.reply(loadingMsg)

let d=new Date
let date=d.toLocaleDateString('ar',{day:'numeric',month:'long',year:'numeric'})

let database=fs.existsSync('./database.json')?await fs.readFileSync('./database.json'):null
let creds=fs.existsSync('./Sessions/creds.json')?await fs.readFileSync('./Sessions/creds.json'):null

if(!database&&!creds){
let errorMsg=await tr(m,`لـم أعـثـر عـلـى مـلـفـات\n تـأكـد مـن وجـود:\n database.json - قاعدة البيانات\n Sessions/creds.json - جلسة البوت`)
return m.reply(errorMsg)
}

let dateInfo=await tr(m,`تـاريـخ الـنـسـخ\n الـتـاريـخ: ${date}\n الـوقـت: ${d.toLocaleTimeString('ar')}`)

await conn.reply(m.chat,dateInfo,m)

if(database){
let dbSuccess=await tr(m,`تـم إرسـال قـاعـدة الـبـيـانـات\n نـوع الـمـلـف: قاعدة البيانات\n الـحـجـم: ${(database.length/1024).toFixed(2)} كيلوبايت\n الـمـسـار: database.json`)

await conn.sendMessage(m.sender,{
document:database,
mimetype:'application/json',
fileName:`database_${Date.now()}.json`,
caption:dbSuccess
},{quoted:m})
}

if(creds){
let credsSuccess=await tr(m,`تـم إرسـال جـلـسـة الـبـوت\n نـوع الـمـلـف: جلسة البوت\n الـحـجـم: ${(creds.length/1024).toFixed(2)} كيلوبايت\n الـمـسـار: Sessions/creds.json`)

await conn.sendMessage(m.sender,{
document:creds,
mimetype:'application/json',
fileName:`creds_${Date.now()}.json`,
caption:credsSuccess
},{quoted:m})
}

let finalSuccess=await tr(m,`تـم الـنـسـخ الـاحـتـيـاطـي بـنـجـاح\n الـمـلـفـات الـمـرسـلـة:\n قاعدة البيانات - بيانات المستخدمين\n جلسة البوت - إعدادات الاتصال\n احفظها في مكان آمن`)

await m.reply(finalSuccess)

}catch(error){
console.error('Backup Error:',error)
let errorMsg=await tr(m,`حـدث خـطـأ فـي الـنـسـخ\n الـسـبـب: ${error.message}\n الـحـل: تـأكـد مـن وجـود الـمـلـفـات\n وجـرب مـرة أخـرى`)
m.reply(errorMsg)
}
}

handler.command=['backup','احتياطي']
handler.help=['backup - نسخ احتياطي للبيانات']
handler.tags=['مالك','بيانات']
handler.rowner=true

export default handler