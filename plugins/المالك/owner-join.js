/**
 * 🎯 أمر: الانضمام لمجموعة عبر الرابط
 * 📍 الصلاحيات: المالك فقط للمجموعات، المستخدمين للإرسال
 * 🌐 المدخل: رابط دعوة مجموعة واتساب
 * 🎪 الفئة: أدوات
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

import{generateWAMessageFromContent,proto}from'@whiskeysockets/baileys'

let linkRegex=/https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

let handler=async(m,{conn,text,isOwner,usedPrefix,command,tr,tb})=>{
try{
if(!text)return m.reply(await tr(m,`يـرجـى إرسـال رابـط الـدعـوة\n الـمـثـال: ${usedPrefix+command} https://chat.whatsapp.com/...\n لـكـي يـنـضـم الـبـوت لـلـمـجـمـوعـة`))

let[_,code]=text.match(linkRegex)||[]

if(!code)return m.reply(await tr(m,`رابـط غـيـر صـالـح\n يـجـب أن يـكـون رابـط دعـوة مـجـمـوعـة\n مـثـال: https://chat.whatsapp.com/...`))

if(isOwner){
await conn.groupAcceptInvite(code)
.then(async(res)=>{
let successText=await tr(m,`تـم الانـضـمـام بـنـجـاح\n الـرابـط: ${text}`)

let buttons=[
{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"الـقـائـمة الـرئـيـسـيـة",id:".menu"})},
{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"نـسـخ الـرابـط",id:"copy_group_link",copy_code:text})}
]

let translatedButtons=await tb(m,buttons)
let msg=generateWAMessageFromContent(m.chat,{
viewOnceMessage:{
message:{
messageContextInfo:{deviceListMetadata:{},deviceListMetadataVersion:2},
interactiveMessage:proto.Message.InteractiveMessage.fromObject({
body:proto.Message.InteractiveMessage.Body.fromObject({text:successText}),
footer:proto.Message.InteractiveMessage.Footer.fromObject({text:await tr(m,"كـاتـي بـوت - نـظـام الانـضـمـام لـلـمـجـمـوعـات")}),
header:proto.Message.InteractiveMessage.Header.fromObject({title:await tr(m,"انـضـمـام نـاجـح"),hasMediaAttachment:false}),
nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({buttons:translatedButtons})
})}}},{quoted:m})
await conn.relayMessage(m.chat,msg.message,{messageId:msg.key.id})
})
.catch(async(err)=>{
let errorText=await tr(m,`فـشـل الانـضـمـام\n تـأكـد مـن صـحـة الـرابـط\n وأن الـدعـوة غـيـر مـنـتـهـيـة`)
m.reply(errorText)
})
}else{
let senderName=conn.getName(m.sender)||'مـسـتـخـدم'
let message=await tr(m,`طـلـب انـضـمـام جـديـد\n الـمـسـتـخـدم: ${senderName}\n الـرقـم: @${m.sender.split('@')[0]}\n رابـط الـمـجـمـوعـة: ${text}\n الـوقـت: ${new Date().toLocaleString()}`)

// إرسال الرسالة للمالك
await conn.sendMessage('201554680406@s.whatsapp.net',{
text:message,
mentions:[m.sender]
},{quoted:m})

let userReply=await tr(m,`تـم إرسـال الـطـلـب\n شـكـراً لـدعـوتـك لـلـبـوت\n تـم إرسـال الـرابـط لـلـمـالـك\n سـيـتـم الـرد عـلـيـك قـريـبـاً`)

let userButtons=[
{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"الـقـائـمة الـرئـيـسـيـة",id:".menu"})},
{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"نـسـخ الـرابـط",id:"copy_invite_link",copy_code:text})}
]

let translatedUserButtons=await tb(m,userButtons)
let userMsg=generateWAMessageFromContent(m.chat,{
viewOnceMessage:{
message:{
messageContextInfo:{deviceListMetadata:{},deviceListMetadataVersion:2},
interactiveMessage:proto.Message.InteractiveMessage.fromObject({
body:proto.Message.InteractiveMessage.Body.fromObject({text:userReply}),
footer:proto.Message.InteractiveMessage.Footer.fromObject({text:await tr(m,"كـاتـي بـوت - نـظـام دعـوات الـمـجـمـوعـات")}),
header:proto.Message.InteractiveMessage.Header.fromObject({title:await tr(m,"طـلـب مـرسـول"),hasMediaAttachment:false}),
nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({buttons:translatedUserButtons})
})}}},{quoted:m})
await conn.relayMessage(m.chat,userMsg.message,{messageId:userMsg.key.id})
}
}catch(e){
console.error(e)
m.reply(await tr(m,`حـدث خـطـأ\n تـأكـد مـن صـحـة الـرابـط وجـرب مـرة أخـرى`))
}
}

handler.command=['join','انضم']
handler.help=['join <رابط> - الانضمام لمجموعة']
handler.tags=['أدوات','مالك']
handler.owner=true

export default handler