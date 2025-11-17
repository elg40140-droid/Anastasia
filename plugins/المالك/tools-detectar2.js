/**
 * 🎯 أمر: فحص الأخطاء البرمجية في جميع الملفات
 * 📍 الصلاحيات: المالك فقط
 * 🌐 المدخل: لا يحتاج
 * 🎪 الفئة: أدوات المطور
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

import fs from 'fs'
import path from 'path'
import{generateWAMessageFromContent,proto}from'@whiskeysockets/baileys'

let handler=async(m,{conn,tr,tb})=>{
try{
await m.react('🕒')
conn.sendPresenceUpdate('composing',m.chat)

const getAllFiles=(dir,fileList=[])=>{
const files=fs.readdirSync(dir)
files.forEach(file=>{
const filePath=path.join(dir,file)
const stat=fs.statSync(filePath)
if(stat.isDirectory()){
getAllFiles(filePath,fileList)
}else if(file.endsWith('.js')||file.endsWith('.mjs')){
fileList.push(filePath)
}})
return fileList
}

const botFiles=getAllFiles('.')
let response=await tr(m,`📂 *فـحـص الأخـطـاء الـبـرمـجـيـة:* ⚡\n\n`)
let hasErrors=false
let totalFiles=0
let errorFiles=0

for(const filePath of botFiles){
try{
totalFiles++
await import(`file://${path.resolve(filePath)}`)
}catch(error){
if(error.code==='ERR_MODULE_NOT_FOUND')continue
hasErrors=true
errorFiles++

const match=error.stack.match(/:(\d+):(\d+)/)
const errorLine=match?match[1]:'غـيـر مـعـروف'
const errorColumn=match?match[2]:'غـيـر مـعـروف'

const fileLines=fs.readFileSync(filePath,'utf8').split('\n')
const start=Math.max(0,errorLine-3)
const end=Math.min(fileLines.length,parseInt(errorLine)+2)
const codePreview=fileLines
.slice(start,end)
.map((line,i)=>{
let lineNumber=start+i+1
return`${lineNumber===parseInt(errorLine)?'👉':'  '}${lineNumber} | ${line}`
})
.join('\n')

response+=await tr(m,`🚩 *خـطـأ فـي:* ${path.relative('.',filePath)}\n`)
response+=await tr(m,`> ● الـرسـالـة: ${error.message}\n`)
response+=await tr(m,`> الـسـطـر: ${errorLine}, الـعـمـود: ${errorColumn}\n`)
response+=await tr(m,`> ● الـكـود:\n\`\`\`js\n${codePreview}\n\`\`\`\n\n`)
}}

if(!hasErrors){
response+=await tr(m,`✅ كـل شـيء بـخـيـر! لـم يـتـم الـعـثـور عـلـى أخـطـاء\n📊 عـدد الـمـلـفـات الـمـفـحـوصـة: ${totalFiles}`)
}else{
response+=await tr(m,`⚠️ راجـع الأخـطـاء الـمـوضـحـة أعـلـاه قـبـل إعـادة تـشـغـيـل الـبـوت\n📊 الـمـلـفـات الـمـفـحـوصـة: ${totalFiles} | الـمـلـفـات ذات الأخـطـاء: ${errorFiles}`)
}

const buttons=[
{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"🔄 إعـادة الـفـحـص",id:"rescan_syntax"})},
{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"📋 نـسـخ الـتـقـريـر",id:"copy_report",copy_code:response})}
]

const translatedButtons=await tb(m,buttons)
const msg=generateWAMessageFromContent(m.chat,{
viewOnceMessage:{
message:{
messageContextInfo:{deviceListMetadata:{},deviceListMetadataVersion:2},
interactiveMessage:proto.Message.InteractiveMessage.fromObject({
body:proto.Message.InteractiveMessage.Body.fromObject({text:response}),
footer:proto.Message.InteractiveMessage.Footer.fromObject({text:await tr(m,"كـاتـي بـوت - نـظـام فـحـص الأخـطـاء")}),
header:proto.Message.InteractiveMessage.Header.fromObject({title:await tr(m,"🔍 تـقـريـر الـفـحـص"),hasMediaAttachment:false}),
nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({buttons:translatedButtons})
})}}},{quoted:m})
await conn.relayMessage(m.chat,msg.message,{messageId:msg.key.id})
await m.react(hasErrors?'⚠️':'✅')

}catch(err){
await m.react('✖️')
console.error(err)
conn.reply(m.chat,await tr(m,'🚩 حـدث فـشـل فـي فـحـص الـمـلـفـات'),m)
}}

handler.command=['scan','فحص']
handler.help=['فحص - فحص جميع ملفات البوت لاكتشاف الأخطاء']
handler.tags=['أدوات','مالك']
handler.rowner=true
handler.register=true

export default handler