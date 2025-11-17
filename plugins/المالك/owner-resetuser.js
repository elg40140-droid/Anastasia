/**
 * 🎯 أمر: حذف بيانات مستخدم من قاعدة البيانات
 * 📍 الصلاحيات: المالك فقط 👑
 * 👥 المدخل: رد على رسالة أو ذكر أو رقم
 * 🗑️ الفئة: مالك
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

let handler=async(m,{conn,text,usedPrefix,command,tr})=>{
try{
const numberPattern=/\d+/g
let user=''
const numberMatches=text.match(numberPattern)

if(numberMatches){
const number=numberMatches.join('')
user=number+'@s.whatsapp.net'
}else if(m.quoted&&m.quoted.sender){
const quotedNumberMatches=m.quoted.sender.match(numberPattern)
if(quotedNumberMatches){
const number=quotedNumberMatches.join('')
user=number+'@s.whatsapp.net'
}else{
return m.reply(await tr(m,`شـكـل غـيـر مـعـروف\n الـرد عـلـى رسـالـة الـمـسـتـخـدم أو منشنه أو كـتـابـة رقـمـه`))
}
}else{
return m.reply(await tr(m,`يـرجـى تـحـديـد الـمـسـتـخـدم\n الـمـثـال: ${usedPrefix+command} 201554680406\n أو الـرد عـلـى رسـالـة الـمـسـتـخـدم أو منشنه`))
}

const groupMetadata=m.isGroup?await conn.groupMetadata(m.chat):{}
const participants=m.isGroup?groupMetadata.participants:[]
const users=m.isGroup?participants.find(u=>u.id===user):{}
const userNumber=user.split('@')[0]

if(!global.db.data.users[user]||global.db.data.users[user]==''){
return m.reply(await tr(m,`الـمـسـتـخـدم غـيـر مـوجـود\n الـمـسـتـخـدم: @${userNumber}\n الـحـالة: غـيـر مـسـجـل فـي الـقـاعـدة`,{mentions:[user]}))
}

// 🗑️ حذف بيانات المستخدم
delete global.db.data.users[user]

// ✅ تأكيد الحذف
const successText=await tr(m,`تـم الـحـذـف بـنـجـاح\n الـمـسـتـخـدم: @${userNumber}\n الـعـمـلـيـة: حـذـف كـل الـبـيـانـات `)

await conn.sendMessage(m.chat,{
text:successText,
mentions:[user]
},{quoted:m})

}catch(error){
console.error(error)
m.reply(await tr(m,`خـطـأ فـي نـظـام الـقـاعـدة`))
}
}

handler.command=['resetuser','حذف_بيانات']
handler.help=['resetuser <رقم/رد/إشارة> - حذف بيانات مستخدم']
handler.tags=['مالك']
handler.rowner=true

export default handler