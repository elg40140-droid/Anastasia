/**
 * 🎯 أمر: انضمام مؤقت للمجموعات
 * 📍 الصلاحيات: المالك والمشرفين فقط
 * 🌐 المدخل: رابط مجموعة + وقت
 * 🎪 الفئة: بوت
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

import fetch from'node-fetch'

let suscripciones=global.suscripciones||(global.suscripciones={})

let handler=async(m,{conn,args,usedPrefix,command,tr,tb})=>{
if(!args[0]||!args[1]){
return m.reply(await tr(m,`✘ اسـتـخـدام غـيـر صـحـيـح.\n\n🌷 مـثـال: *${usedPrefix+command} رابـط 3d*  
(اسـتـخـدم m = دقـائـق, h = سـاعـات, d = أيـام, w = أسـابـيع)`))}

let enlace=args[0].trim()
let tiempoStr=args[1].toLowerCase()

if(!enlace.startsWith('https://chat.whatsapp.com/')){
return m.reply(await tr(m,'✘ رابـط غـيـر صـحـيـح.'))}

let tiempoMs=0
let cantidad=parseInt(tiempoStr)

if(isNaN(cantidad)||cantidad<1){
return m.reply(await tr(m,'✘ أدخـل رقـمـاً صـحـيـحـاً (مـثـال: 10m, 5h, 2d, 1w).'))}

if(tiempoStr.endsWith('m'))tiempoMs=cantidad*60*1000// دقـائـق
else if(tiempoStr.endsWith('h'))tiempoMs=cantidad*60*60*1000// سـاعـات
else if(tiempoStr.endsWith('d'))tiempoMs=cantidad*24*60*60*1000// أيـام
else if(tiempoStr.endsWith('w'))tiempoMs=cantidad*7*24*60*60*1000// أسـابـيع
else return m.reply(await tr(m,'✘ وحـدة الـوقـت غـيـر صـحـيـحـة. اسـتـخـدم: m = دقـائـق, h = سـاعـات, d = أيـام, w = أسـابـيع.'))

let codigoGrupo=enlace.split('https://chat.whatsapp.com/')[1]?.trim()
if(!codigoGrupo)return m.reply(await tr(m,'✘ كـود الـمـجـمـوعـة غـيـر صـحـيـح.'))

await m.reply(await tr(m,'جـاري الانـضـمـام 💥'))

try{
let groupId=await conn.groupAcceptInvite(codigoGrupo)
let groupMetadata=await conn.groupMetadata(groupId)
let groupName=groupMetadata.subject

let url=await conn.profilePictureUrl(m.chat,'image').catch(_=>null)
let admins=groupMetadata.participants.filter(p=>p.admin).map(p=>p.id)
let mentionList=[m.sender,...admins]

const welcomeMsg=await tr(m,`💥 انـضـم الـبـوت إلـى *${groupName}*.\n\n☘️ سـيـكـون مـوجـوداً لـمـدة *${cantidad}${tiempoStr.replace(cantidad,'')}*.\n\n🍂 ثـم سـيـغـادر تـلـقـائـيـاً.`)

await conn.sendMessage(groupId,{
text:welcomeMsg,
mentions:mentionList,
contextInfo:{
externalAdReply:{
title:await tr(m,`مـرحـباً أيـهـا الـمـجـمـوعـة: ${groupName}`),
body:await tr(m,'☘️◌*̥₊ كـاتـي بـوت ◌❐⚽༉'),
thumbnailUrl:url||global.logo,
sourceUrl:global.gp1,
mediaType:1,
renderLargerThumbnail:true
}}
},{quoted:global.fkontak})

if(suscripciones[groupId])clearTimeout(suscripciones[groupId])
suscripciones[groupId]=setTimeout(async()=>{
try{
const leaveMsg=await tr(m,'*⏳ انـتـهـى الـوقـت. سـيـغـادر الـبـوت الـمـجـمـوعـة.*')
await conn.sendMessage(groupId,{text:leaveMsg})
await conn.groupLeave(groupId)
delete suscripciones[groupId]
}catch(err){
console.log(await tr(m,`خـطـأ عـنـد مـغـادرة الـمـجـمـوعـة: ${err.message}`))
}},tiempoMs)

const successMsg=await tr(m,`✅ تـم الانـضـمـام إلـى الـمـجـمـوعـة بـنـجـاح!\n\n📌 الاسـم: ${groupName}\n⏰ الـمـدة: ${cantidad}${tiempoStr.replace(cantidad,'')}\n👥 الأعـضـاء: ${groupMetadata.participants.length}`)

const buttons=[
{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"🌐 زيـارة الـمـجـمـوعـة",url:enlace})},
{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"⏰ تـحـديـد مـدة جـديـدة",id:"new_subscription"})}
]

const translatedButtons=await tb(m,buttons)
const msg=generateWAMessageFromContent(m.chat,{
viewOnceMessage:{
message:{
messageContextInfo:{deviceListMetadata:{},deviceListMetadataVersion:2},
interactiveMessage:proto.Message.InteractiveMessage.fromObject({
body:proto.Message.InteractiveMessage.Body.fromObject({text:successMsg}),
footer:proto.Message.InteractiveMessage.Footer.fromObject({text:await tr(m,"كـاتـي بـوت - نـظـام الانـضـمـام الـمـؤقـت")}),
header:proto.Message.InteractiveMessage.Header.fromObject({title:await tr(m,"✅ انـضـمـام نـاجـح"),hasMediaAttachment:false}),
nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({buttons:translatedButtons})
})}}},{quoted:m})
await conn.relayMessage(m.chat,msg.message,{messageId:msg.key.id})

}catch(e){
console.error(e)
const errorMsg=await tr(m,`✘ خـطـأ فـي الانـضـمـام إلـى الـمـجـمـوعـة:\n${e?.message||'لـم يـتـم الانـضـمـام. تـحـقـق مـن الـرابـط.'}`)
const errorButtons=[
{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"🔄 مـحـاولـة مـجـددا",id:"retry_join"})}
]
const translatedErrorButtons=await tb(m,errorButtons)
const errorMsgObj=generateWAMessageFromContent(m.chat,{
viewOnceMessage:{
message:{
messageContextInfo:{deviceListMetadata:{},deviceListMetadataVersion:2},
interactiveMessage:proto.Message.InteractiveMessage.fromObject({
body:proto.Message.InteractiveMessage.Body.fromObject({text:errorMsg}),
footer:proto.Message.InteractiveMessage.Footer.fromObject({text:await tr(m,"كـاتـي بـوت - نـظـام الـخـطـأ")}),
header:proto.Message.InteractiveMessage.Header.fromObject({title:await tr(m,"❌ فـشـل الانـضـمـام"),hasMediaAttachment:false}),
nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({buttons:translatedErrorButtons})
})}}},{quoted:m})
await conn.relayMessage(m.chat,errorMsgObj.message,{messageId:errorMsgObj.key.id})}}

handler.help=['joinfor <رابط> <وقت> - انضمام مؤقت للمجموعة']
handler.tags=['بوت']
handler.command=['joinfor','اشتراك']
handler.owner=true
handler.admin=true

export default handler