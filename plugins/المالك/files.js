import{promises as fs}from'fs'
import{join,dirname}from'path'
let handler=async(m,{conn,usedPrefix,args,command})=>{
let path=args[0]?join(process.cwd(),...args):join(process.cwd(),'plugins')
let currentDir=args[0]?args.join('/'):'plugins'
try{
let items=await fs.readdir(path,{withFileTypes:true})
let fileRows=[],folderRows=[]
for(let item of items){
if(item.isFile()&&(item.name.endsWith('.js')||item.name.endsWith('.mjs'))){
fileRows.push({header:"📄",title:item.name,description:`ملف أمر - ${item.name}`,id:`${usedPrefix}هات ${currentDir}/${item.name}`})
}else if(item.isDirectory()&&!item.name.startsWith('.')){
folderRows.push({header:"📁",title:item.name,description:`مجلد - ${item.name}`,id:`${usedPrefix}كوم ${currentDir}/${item.name}`})
}}
let allRows=[...folderRows,...fileRows]
let sections=[]
if(folderRows.length>0){
sections.push({title:"📁 المجلدات الفرعية",rows:folderRows.slice(0,10)})
}
if(fileRows.length>0){
sections.push({title:"📄 ملفات الأوامر",rows:fileRows.slice(0,10)})
}
sections.push({title:"⚡ إجراءات سريعة",rows:[
{header:"🔙",title:"الرجوع للخلف",description:"العودة للمجلد السابق",id:args.length>1?`${usedPrefix}كوم ${args.slice(0,-1).join('/')}`:`${usedPrefix}كوم`},
{header:"➕",title:"إضافة أمر جديد",description:"إنشاء ملف أمر جديد",id:`${usedPrefix}اضف ${currentDir}/`},
{header:"🏠",title:"الرئيسية",description:"العودة للمجلد الرئيسي",id:`${usedPrefix}كوم`}
]})
let headerText=`*📂 تصفح الملفات*\n\n📍 *المسار:* ${currentDir}\n📁 *المجلدات:* ${folderRows.length}\n📄 *اللفات:* ${fileRows.length}\n\n𓆩🌹𓆪 اختر ملف أو مجلد من القائمة`
await conn.sendAllButtons({jid:m.chat,text:headerText,footer:"كاتي بوت - نظام الملفات",title:"🧩 نظام الملفات المتقدم",listButtons:[["📂 اختر من القائمة",sections]],buttons:[["🔄 تحديث القائمة","refresh_list"]],copyButtons:[["📋 نسخ المسار",currentDir]]},m)
}catch(error){
console.error(error)
m.reply(`*❌ خطأ:* المجلد غير موجود أو لا توجد صلاحيات للوصول`)
}}
handler.help=['- [مسار]']
handler.tags=['owner']
handler.command=['files','الملفات']
handler.rowner=true
export default handler