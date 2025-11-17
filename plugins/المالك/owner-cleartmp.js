/**
 * 🎯 أمر: تنظيف الملفات المؤقتة
 * 📍 الصلاحيات: المالك فقط
 * 🗑️ الوظيفة: حذف جميع الملفات من مجلد tmp
 * 🎪 الفئة: مالك
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

import{tmpdir}from'os'
import path,{join}from'path'
import{readdirSync,statSync,unlinkSync,existsSync}from'fs'

let handler=async(m,{conn,usedPrefix: _p,__dirname,tr})=>{
try{
// 🎯 إرسال رسالة البدء
let startMsg=await tr(m,`جـارٍ تـنـظـيـف الـمـلـفـات الـمـؤقـتـة\n الـعـمـلـيـة: حـذـف مـلـفـات tmp\n الـحـالـة: تـنـفـيـذ الـعـمـلـيـة\n يـرجـى الـانـتـظـار...`)

await m.reply(startMsg)

// 🗑️ تعريف المجلدات المؤقتة
const tmp=[tmpdir(),join(__dirname,'../tmp')]
const filename=[]

// 🔍 جمع جميع الملفات
tmp.forEach(dirname=>{
if(existsSync(dirname)){
readdirSync(dirname).forEach(file=>filename.push(join(dirname,file)))
}
})

let deletedCount=0
let errorCount=0

// 🎯 حذف الملفات
filename.forEach(file=>{
try{
if(existsSync(file)){
const stats=statSync(file)
if(stats.isFile()){
unlinkSync(file)
deletedCount++
}
}
}catch(e){
console.error(`فشل في حذف ${file}:`,e.message)
errorCount++
}
})

// ✅ رسالة النجاح
let successMsg=await tr(m,`تـم الـتـنـظـيـف بـنـجـاح\n الـعـمـلـيـة: تـنـظـيـف مـلـفـات tmp\n عـدد الـمـلـفـات الـمـحـذوفـة: ${deletedCount}\n عـدد الأخـطـاء: ${errorCount}`)

await m.reply(successMsg)

}catch(error){
console.error(error)

// ❌ رسالة الخطأ
let errorMsg=await tr(m,`فـشـل فـي الـتـنـظـيـف\n الـسـبـب: خـطـأ فـي نـظـام الـمـلـفـات\n جـرب الـأمـر مـرة أخـرى لـاحـقـاً`)

await m.reply(errorMsg)
}
}

handler.help=['cleartmp']
handler.tags=['مالك','نظام']
handler.command=['cleartmp','تنظيف']
handler.rowner=true

export default handler