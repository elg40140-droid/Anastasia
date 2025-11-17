/**
 * 🎯 أمر: سحب نقاط من مستخدم
 * 📍 الصلاحيات: المالك فقط
 * 👤 المدخل: منشن المستخدم + عدد النقاط
 * 🎪 الفئة: مالك
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

import{generateWAMessageFromContent,proto}from'@whiskeysockets/baileys'

let handler=async(m,{conn,text,usedPrefix,command,tr,tb})=>{
try{
let who
if(m.isGroup){
if(m.mentionedJid.length>0){
who=m.mentionedJid[0]
}else{
const quoted=m.quoted?m.quoted.sender:null
who=quoted?quoted:m.chat
}
}else{
who=m.chat
}

if(!who)return m.reply(await tr(m,`يـرجـى اشـارة الـمـسـتـخـدم\n الـمـثـال: ${usedPrefix+command} @المستخدم 100 أو: رد عـلـى رسـالـة الـمـسـتـخـدم`))

let txt=text.replace('@'+who.split`@`[0],'').trim()
let dmt

if(txt.toLowerCase()==='all'){
dmt=global.db.data.users[who].exp
}else{
if(!txt)return m.reply(await tr(m,`يـرجـى إدخـال عـدد الـنـقـاط\n الـمـثـال: ${usedPrefix+command} @المستخدم 100 أو: ${usedPrefix+command} @المستخدم all`))
if(isNaN(txt))return m.reply(await tr(m,`رقـم غـيـر صـالـح\n يـجـب أن يـكـون عـدد صـحـيـح\n مـثـال: 100، 500، 1000`))

dmt=parseInt(txt)
}

let users=global.db.data.users

if(users[who].exp<dmt){
return m.reply(await tr(m,`نـقـاط غـيـر كـافـيـة\n الـمـسـتـخـدم لـديـه: ${users[who].exp} نـقـطـة \n الـمـطـلـوب: ${dmt} نـقـطـة\n الـفـرق: ${dmt-users[who].exp} نـقـطـة`))
}

users[who].exp-=dmt

let successText=await tr(m,`تـم سـحـب الـنـقـاط \n الـمـبـلـغ: ${dmt} نـقـطـة\n الـمـسـتـخـدم: @${who.split('@')[0]}\n الـرصـيـد الـحـالـي: ${users[who].exp} نـقـطـة\n الـمـشـرف: ${conn.getName(m.sender)}`)

let buttons=[
{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"💰 إضـافـة نـقـاط",id:`.addxp @${who.split('@')[0]} ${dmt}`})},
{name:"quick_reply",buttonParamsJson:JSON.stringify({display_text:"مـعـلـومـات الـمـسـتـخـدم",id:`.profile @${who.split('@')[0]}`})},
{name:"cta_copy",buttonParamsJson:JSON.stringify({display_text:"نـسـخ الايـدي",id:"copy_user_id",copy_code:who.split('@')[0]})}
]

let translatedButtons=await tb(m,buttons)
let msg=generateWAMessageFromContent(m.chat,{
viewOnceMessage:{
message:{
messageContextInfo:{deviceListMetadata:{},deviceListMetadataVersion:2},
interactiveMessage:proto.Message.InteractiveMessage.fromObject({
body:proto.Message.InteractiveMessage.Body.fromObject({text:successText}),
footer:proto.Message.InteractiveMessage.Footer.fromObject({text:await tr(m,"كـاتـي بـوت - نـظـام إدارة الـنـقـاط")}),
header:proto.Message.InteractiveMessage.Header.fromObject({title:await tr(m,"سـحـب نـقـاط"),hasMediaAttachment:false}),
nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({buttons:translatedButtons})
})}}},{quoted:m})

await conn.relayMessage(m.chat,msg.message,{messageId:msg.key.id})

}catch(e){
console.error(e)
m.reply(await tr(m,`خـطـأ فـي الـمـعـالـجـة`))
}
}

handler.command=['removexp','سحب_نقاط']
handler.help=['removexp @المستخدم العدد - سحب نقاط من مستخدم']
handler.tags=['مالك','نقاط']
handler.rowner=true

export default handler