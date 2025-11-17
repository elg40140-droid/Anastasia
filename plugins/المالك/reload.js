// plugins/owner/reload.js
import{readdirSync,watch,readFileSync,statSync,existsSync}from'fs'
import{join,dirname,basename}from'path'
import{fileURLToPath}from'url'
import{generateWAMessageFromContent,proto}from'@whiskeysockets/baileys'

const __dirname=dirname(fileURLToPath(import.meta.url))

let fileWatchers=new Map()
let isWatching=false
let reloadCooldown=new Map()

export let reloadSystem={isActive:false,watchers:new Map(),cooldowns:new Map()}

function clearImportCache(filePath){
const cacheKeys=Object.keys(require.cache)
cacheKeys.forEach(key=>{
if(key.includes(filePath)||key.includes(process.cwd())){
delete require.cache[key]
}})
}

async function reloadFile(filePath){
try{
if(reloadCooldown.has(filePath)&&Date.now()-reloadCooldown.get(filePath)<1000){
return{success:false,reason:'cooldown'}
}
reloadCooldown.set(filePath,Date.now())
clearImportCache(filePath)
const timestamp=`?update=${Date.now()}`
const fileUrl=`file://${filePath}${timestamp}`
const newModule=await import(fileUrl)
return{success:true,module:newModule}
}catch(error){
console.error(`❌${filePath}:`,error)
return{success:false,reason:error.message}
}
}

function getAllFiles(dir,fileList=[]){
try{
const files=readdirSync(dir,{withFileTypes:true})
files.forEach(file=>{
const filePath=join(dir,file.name)
if(file.isDirectory()){
if(!file.name.startsWith('.')&&file.name!=='node_modules'){
getAllFiles(filePath,fileList)
}}else if(file.isFile()&&file.name.endsWith('.js')){
fileList.push(filePath)
}})
return fileList
}catch(error){
console.error(`❌${dir}:`,error)
return fileList
}
}

async function reloadFolder(folderPath,folderName){
let successCount=0
let errorCount=0
let errors=[]
try{
const files=getAllFiles(folderPath)
console.log(`📁${folderName}:${files.length}`)
for(let filePath of files){
try{
const result=await reloadFile(filePath)
if(result.success){
successCount++
console.log(`✅${basename(filePath)}`)
}else{
errorCount++
errors.push({file:basename(filePath),error:result.reason})
console.log(`❌${basename(filePath)}-${result.reason}`)
}}catch(fileError){
errorCount++
errors.push({file:basename(filePath),error:fileError.message})
}}
return{successCount,errorCount,errors,total:files.length}
}catch(error){
console.error(`❌${folderName}:`,error)
return{successCount:0,errorCount:1,errors:[{file:folderName,error:error.message}],total:0}
}
}

function startAutoReload(conn,m){
if(isWatching)return{success:false,message:'المراقبة مفعلة!'}
const foldersToWatch=[
{path:join(process.cwd(),'plugins'),name:'الاوامر'},
{path:join(process.cwd(),'lib'),name:'المكتبات'}
]
foldersToWatch.forEach(({path,name})=>{
try{
if(statSync(path).isDirectory()){
console.log(`👀${name}`)
const watcher=watch(path,{recursive:true},async(eventType,filename)=>{
if(filename&&filename.endsWith('.js')){
const filePath=join(path,filename)
setTimeout(async()=>{
try{
const result=await reloadFile(filePath)
if(result.success){
console.log(`🔄${filename}`)
if(m){
let notifyText=`🔄تحديث تلقائي\n📁${name}\n📄${filename}\n⏰${new Date().toLocaleTimeString()}`
conn.sendMessage(m.sender,{text:notifyText},{quoted:m})
}}catch(error){
console.error(`❌${filename}:`,error)
}},500)
}})
fileWatchers.set(path,watcher)
reloadSystem.watchers.set(path,watcher)
}}catch(error){
console.error(`❌${name}:`,error)
}})
isWatching=true
reloadSystem.isActive=true
return{success:true,message:'تم تشغيل المراقبة!'}
}

function stopAutoReload(){
if(!isWatching)return{success:false,message:'المراقبة غير مفعلة!'}
fileWatchers.forEach((watcher,path)=>{
watcher.close()
console.log(`🛑${path}`)
})
fileWatchers.clear()
reloadSystem.watchers.clear()
isWatching=false
reloadSystem.isActive=false
return{success:true,message:'تم إيقاف المراقبة!'}
}

async function safeReloadFolder(folderPath,folderName){
let successCount=0
let errorCount=0
let errors=[]
try{
const files=getAllFiles(folderPath)
console.log(`🔄${folderName}:${files.length}`)
for(let filePath of files){
try{
clearImportCache(filePath)
const fileUrl=`file://${filePath}?update=${Date.now()}`
await import(fileUrl)
successCount++
console.log(`✅${basename(filePath)}`)
}catch(fileError){
errorCount++
let errorMsg=fileError.message
if(errorMsg.includes('require is not defined')){
errorMsg='مشكلة ES Modules'
}else if(errorMsg.includes('Cannot find module')){
errorMsg='ملف غير موجود'
}else if(errorMsg.includes('Unexpected token')){
errorMsg='خطأ في الجملة'
}
errors.push({file:basename(filePath),error:errorMsg})
console.log(`❌${basename(filePath)}-${errorMsg}`)
}}
return{successCount,errorCount,errors,total:files.length}
}catch(error){
console.error(`❌${folderName}:`,error)
return{successCount:0,errorCount:1,errors:[{file:folderName,error:error.message}],total:0}
}
}

let handler=async(m,{conn,args,usedPrefix,command,tr})=>{

const subCommand=args[0]?.toLowerCase()||'all'

if(subCommand==='auto'||subCommand==='تلقائي'){
const result=startAutoReload(conn,m)
let autoText=await tr(m,`🤖*نظام المراقبة التلقائية*\n🎯الحالة:${result.success?'مفعل':'مفعل بالفعل'}\n📁المجلدات:الأوامر،المكتبات\n🔍الوظيفة:مراقبة التعديلات التلقائية\n⏰الوقت:${new Date().toLocaleString()}`)
return m.reply(autoText)
}

if(subCommand==='stop'||subCommand==='ايقاف'){
const result=stopAutoReload()
let stopText=await tr(m,`🛑*إيقاف المراقبة*\n🎯الحالة:${result.success?'متوقف':'غير مفعل'}\n📊المراقبة:تم تعطيل النظام\n⏰الوقت:${new Date().toLocaleString()}`)
return m.reply(stopText)
}

if(subCommand==='status'||subCommand==='حالة'){
let statusText=await tr(m,`📊*حالة نظام الريلود*\n🤖المراقبة:${isWatching?'🟢مفعل':'🔴متوقف'}\n📁المجلدات:${fileWatchers.size}تحت المراقبة\n🔄آخر تحديث:${new Date().toLocaleString()}\n💾الذاكرة:${Math.round(process.memoryUsage().heapUsed/1024/1024)}MB`)
return m.reply(statusText)
}

let reloadResult
let actionName=''

switch(subCommand){
case'all':
case'كل':
actionName='جميع الملفات'
console.log('🔄بدء إعادة تحميل جميع الملفات...')
reloadResult=await Promise.all([
safeReloadFolder(join(process.cwd(),'plugins'),'الاوامر'),
safeReloadFolder(join(process.cwd(),'lib'),'المكتبات')
])
break
case'plugins':
case'الاوامر':
actionName='الاوامر'
reloadResult=[await safeReloadFolder(join(process.cwd(),'plugins'),'الاوامر')]
break
case'lib':
case'مكتبات':
actionName='المكتبات'
reloadResult=[await safeReloadFolder(join(process.cwd(),'lib'),'المكتبات')]
break
default:
const filePath=join(process.cwd(),subCommand)
try{
const result=await reloadFile(filePath)
if(result.success){
reloadResult=[{successCount:1,errorCount:0,total:1,errors:[]}]
actionName=`ملف:${basename(subCommand)}`
}else{
return m.reply(await tr(m,`❌*خطأ في التحميل*\n📄الملف:${subCommand}\n💫الخطأ:${result.reason}`))
}}catch(error){
return m.reply(await tr(m,`❌*ملف غير موجود*\n📄الملف:${subCommand}\n💫الخطأ:${error.message}`))
}
}
let totalSuccess=reloadResult.reduce((sum,r)=>sum+r.successCount,0)
let totalErrors=reloadResult.reduce((sum,r)=>sum+r.errorCount,0)
let totalFiles=reloadResult.reduce((sum,r)=>sum+r.total,0)
let allErrors=reloadResult.flatMap(r=>r.errors)
let resultText=await tr(m,`🔄*نتائج إعادة التحميل*\n📁الإجراء:${actionName}\n📊الملفات:${totalFiles}ملف\n✅الناجح:${totalSuccess}ملف\n❌الفاشل:${totalErrors}ملف\n⏰الوقت:${new Date().toLocaleString()}`)
if(allErrors.length>0){
let errorDetails=allErrors.slice(0,5).map((err,index)=>`${index+1}.${err.file}:${err.error}`).join('\n')
if(allErrors.length>5)errorDetails+=`\n...و${allErrors.length-5}خطأ آخر`
resultText+=`\n\n📋*الأخطاء:*\n${errorDetails}`
}
try{
await conn.sendAllButtons({jid:m.chat,text:resultText,footer:"انستازيا - نظام إعادة التحميل المتقدم",title:"🔄 نتائج الريلود",image:global.logo,buttons:[["🔄 إعادة تحميل الكل",`.reload all`],[isWatching?"🛑 إيقاف المراقبة":"🤖 تشغيل التلقائي",`.reload auto`],["📊 حالة النظام",`.reload status`]],copyButtons:[["📋 نسخ التقرير",`إعادة تحميل:${actionName}-${totalSuccess}/${totalFiles}ناجح`]],listButtons:allErrors.length>0?[["📋 قائمة الأخطاء",[{title:"🔄 الأخطاء التفصيلية",rows:allErrors.slice(0,8).map((err,index)=>({header:"❌",title:err.file.length>20?err.file.substring(0,17)+'...':err.file,description:err.error.length>30?err.error.substring(0,27)+'...':err.error,id:`.reload ${err.file}`}))}]]]:[]},m)
}catch(error){
console.error('❌خطأ في الأزرار:',error)
await m.reply(resultText)
}
}

handler.help=['-all/plugins/lib/auto/stop/status']
handler.tags=['owner','system']
handler.command=['reload','ريلود','ريل','اعادة','تحديث']

export default handler