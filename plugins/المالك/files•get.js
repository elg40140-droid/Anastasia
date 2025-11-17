import{promises as fs}from'fs'
import{join}from'path'
let handler=async(m,{conn,usedPrefix,args,command})=>{
if(!args[0])return m.reply(`*⚠️ يرجى كتابة اسم الملف*`)
let filepath=join(process.cwd(),...args[0].split('/'))
try{
let content=await fs.readFile(filepath,'utf8')
let fileInfo=await fs.stat(filepath)
let preview=content.length>3000?content.slice(0,3000)+"\n\n... (المحتوى طويل - استخدم زر النسخ)":content
let fileText=`*📖 محتوى الملف*\n\n📄 *الملف:* ${args[0]}\n📊 *الحجم:* ${(fileInfo.size/1024).toFixed(2)} كيلوبايت\n⏰ *التعديل:* ${fileInfo.mtime.toLocaleString()}\n\n📝 *المحتوى:*\n${preview}`
await conn.sendAllButtons({jid:m.chat,text:fileText,footer:"كاتي بوت - عرض الملف",title:"📖 عرض الملف",copyButtons:[["📋 نسخ الكود كامل",content]],urlButtons:[["🌐 فتح في GitHub",`https://github.com/DARK-STEN`]]},m)
}catch{
m.reply(`*❌ خطأ:* الملف غير موجود أو لا يمكن قراءته`)
}}
handler.help=['- [اسم]']
handler.tags=['owner']
handler.command=['get','هات']
handler.rowner=true
export default handler