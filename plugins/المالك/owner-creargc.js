/**
 * 🎯 أمر: إنشاء مجموعة واتساب جديدة
 * 📍 الصلاحيات: المالك فقط 👑
 * 🌐 المدخل: اسم المجموعة
 * 🎪 الفئة: إدارة
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

import{generateWAMessageFromContent,proto}from'@whiskeysockets/baileys'

let handler=async(m,{conn,text,usedPrefix,command,tr,tb})=>{
try{
if(!text)return m.reply(await tr(m,`يـرجـى إدخـال اسـم لـلـمـجـمـوعـة\n الـمـثـال: ${usedPrefix+command} اسـم الـمـجـمـوعـة\n أو: ${usedPrefix+command} مـجـمـوعـة كـاتـي`))

m.reply(await tr(m,`جـارٍ إنـشـاء الـمـجـمـوعـة\n الاسـم: ${text}\n الـمـالـك: ${conn.getName(m.sender)}\n يـرجـى الـانـتـظـار...`))

let group=await conn.groupCreate(text,[m.sender])
let link=await conn.groupInviteCode(group.gid)
let inviteLink='https://chat.whatsapp.com/'+link

let successText=await tr(m,`تـم إنـشـاء الـمـجـمـوعـة بـنـجـاح\n اسـم الـمـجـمـوعـة: ${text}\n ايـدي الـمـجـمـوعـة: ${group.gid}\n الـمـالـك: ${conn.getName(m.sender)}\n عـدد الأعـضـاء: 1 عـضـو\n رابـط الـدعـوة: ${inviteLink}`)

let buttons=[
{name:"cta_url",buttonParamsJson:JSON.stringify({display_text:"انـضـم للـمـجـمـوعـة",url:inviteLink})},
{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"نـسـخ الـرابـط",id:"copy_group_link",copy_code:inviteLink})},
{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"نـسـخ ايـدي الـمـجـمـوعـة",id:"copy_group_id",copy_code:group.gid})},
{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"إنـشـاء مـجـمـوعـة أخـرى",id:"create_another_group"})}
]

let translatedButtons=await tb(m,buttons)
let msg=generateWAMessageFromContent(m.chat,{
viewOnceMessage:{
message:{
messageContextInfo:{deviceListMetadata:{},deviceListMetadataVersion:2},
interactiveMessage:proto.Message.InteractiveMessage.fromObject({
body:proto.Message.InteractiveMessage.Body.fromObject({text:successText}),
footer:proto.Message.InteractiveMessage.Footer.fromObject({text:await tr(m,"كـاتـي بـوت - نـظـام إنـشـاء الـمـجـمـوعـات")}),
header:proto.Message.InteractiveMessage.Header.fromObject({title:await tr(m,"تـم الإنـشـاء"),hasMediaAttachment:false}),
nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({buttons:translatedButtons})
})}}},{quoted:m})
await conn.relayMessage(m.chat,msg.message,{messageId:msg.key.id})

}catch(e){
console.error(e)
m.reply(await tr(m,`حـدث خـطـأ فـي الإنـشـاء\n الـسـبـب: ${e.message||'خـطـأ غـيـر مـعـروف'}`))
}
}

handler.command=['creargc','انشاء_جروب']
handler.help=['creargc <اسم> - إنشاء مجموعة جديدة']
handler.tags=['ادارة','مجموعة']
handler.rowner=true

export default handler