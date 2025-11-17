import{watch}from'fs'
import{join,relative}from'path'
let handler=async(m,{conn,args,usedPrefix})=>{
let path=args[0]?join(process.cwd(),...args):process.cwd()
let watchers=global.fileWatchers||new Map()
if(watchers.has(path)){
watchers.get(path).close()
watchers.delete(path)
global.fileWatchers=watchers
return conn.sendAllButtons({jid:m.chat,text:`✅*تم إيقاف المراقبة:*\n📁${relative(process.cwd(),path)}`,title:"👁️ نظام المراقبة",footer:"انستازيا - نظام الملفات المتقدم",image:global.logo,buttons:[["🔄 إعادة التشغيل",".restart"],["📊 معلومات النظام",".system"],["🎪 القائمة الرئيسية",".menu"]]},m)
}
let watcher=watch(path,{recursive:true},async(eventType,filename)=>{
if(filename&&(filename.endsWith('.js')||filename.endsWith('.mjs'))){
let filePath=join(path,filename)
setTimeout(async()=>{
try{
delete require.cache[require.resolve(filePath)]
let timestamp=`?update=${Date.now()}`
await import(`file://${filePath}${timestamp}`)
conn.sendMessage(m.sender,{text:`🔄*تم تحديث تلقائي:*\n📄${filename}\n⏰${new Date().toLocaleString('ar-EG')}`},{quoted:m})
}catch(error){
conn.sendMessage(m.sender,{text:`❌*فشل التحديث:*\n📄${filename}\n💥${error.message}`},{quoted:m})
}},1000)
}})
watchers.set(path,watcher)
global.fileWatchers=watchers
conn.sendAllButtons({jid:m.chat,text:`👁️*تم بدء المراقبة:*\n📁${relative(process.cwd(),path)}\n\n🎯*سيتم إعادة تحميل الملفات تلقائياً عند التعديل*`,title:"👁️ نظام المراقبة",footer:"انستازيا - نظام الملفات المتقدم",image:global.logo,buttons:[["🛑 إيقاف المراقبة",`.watch ${args[0]||''}`],["📁 عرض الملفات",".files"],["🔍 بحث في الملفات",".search"]]},m)
}
handler.help=['- [path]']
handler.tags=['owner']
handler.command=['watch','مراقبة']
handler.rowner=true
export default handler