/**
 * 🎯 أمر: حظر وإلغاء حظر المستخدمين
 * 📍 الصلاحيات: المالك فقط
 * 👥 المدخل: منشن، رد، أو رقم
 * 🎪 الفئة: أدمن
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

let handler=async(m,{text,conn,usedPrefix,command,tr})=>{
try{
const why=await tr(m,`اسـتـخـدام غـيـر صـحـيـح\n الـطـريـقـة الـصـحـيـحـة:\n${usedPrefix+command} @المستخدم\n${usedPrefix+command} بالرد على رسالة\n${usedPrefix+command} 201xxxxxxxx`)

const who=m.mentionedJid[0]?m.mentionedJid[0]:m.quoted?m.quoted.sender:text?text.replace(/[^0-9]/g,'')+'@s.whatsapp.net':false

if(!who)return conn.reply(m.chat,why,m,{mentions:[m.sender]})

const res=[]
let actionText=''
let successText=''

switch(command){
case'blok':case'block':
if(who){
await conn.updateBlockStatus(who,'block').then(()=>{
res.push(who)
})
actionText=await tr(m,"حـظـر")
successText=await tr(m,`تـم الـحـظـر بـنـجـاح\n الـمـسـتـخـدم: @${who.split('@')[0]}`)
}else conn.reply(m.chat,why,m,{mentions:[m.sender]})
break

case'unblok':case'unblock':
if(who){
await conn.updateBlockStatus(who,'unblock').then(()=>{
res.push(who)
})
actionText=await tr(m,"إلـغـاء الـحـظـر")
successText=await tr(m,`تـم إلـغـاء الـحـظـر بـنـجـاح\n الـعـمـلـيـة: إلـغـاء حـظـر مـسـتـخـدم\n الـمـسـتـخـدم: @${who.split('@')[0]}\n الـحـالة: تـمـت بـنـجـاح`)
}else conn.reply(m.chat,why,m,{mentions:[m.sender]})
break
}

if(res[0]){
conn.reply(m.chat,successText,m,{
mentions:res
})
}

}catch(error){
console.error(error)
conn.reply(m.chat,await tr(m,`حـدث خـطـأ\n الـسـبـب: خـطـأ فـي تـنـفـيـذ الأمـر\n الـحـل: تـأكـد مـن الـمـعـلـومـات وجـرب مـرة أخـرى`),m)
}
}

handler.command=['block','حظر','unblock','انبلوك']
handler.help=[
'block <@user> - حظر مستخدم',
'unblock <@user> - إلغاء حظر مستخدم'
]
handler.tags=['أدمن','مالك']
handler.rowner=true

export default handler