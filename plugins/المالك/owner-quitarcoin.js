/**
 * 🎯 أمر: إزالة نقاط من مستخدم
 * 📍 الصلاحيات: المالك فقط
 * 👤 المدخل: منشن المستخدم + عدد النقاط
 * 💰 الفئة: مالك
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

let handler=async(m,{conn,text,usedPrefix,command,tr})=>{
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

if(!who)return m.reply(await tr(m,` يـرجـى الرد ع رسـالـة الـمـسـتـخـدم\n أو اسـتـخـدم الأمـر مـع مـنـشـن\n مـثـال: ${usedPrefix+command} @المستخدم 100`))

let txt=text.replace('@'+who.split`@`[0],'').trim()
let dmt

if(txt.toLowerCase()==='all'){
dmt=global.db.data.users[who].coin
}else{
if(!txt)return m.reply(await tr(m,`يـرجـى إدخـال عـدد الـنـقـاط\n الـمـثـال: ${usedPrefix+command} @المستخدم 100\n أو: ${usedPrefix+command} all لـإزالـة الـكـل`))
if(isNaN(txt))return m.reply(await tr(m,`رقـم غـيـر صـالـح\n يـجـب أن تـكـون الـقـيـمـة رقـمـاً\n مـثـال: 100، 500، 1000`))

dmt=parseInt(txt)
}

let users=global.db.data.users

if(users[who].coin<dmt){
return m.reply(await tr(m,`نـقـاط غـيـر كـافـيـة\n الـمـسـتـخـدم لـديـه: ${users[who].coin} ${global.moneda}\n الـمـطـلـوب إزالـتـه: ${dmt} ${global.moneda}\n الـفـرق: ${dmt-users[who].coin} ${global.moneda}`))
}

users[who].coin-=dmt

let successText=await tr(m,`تـمـت الـعـمـلـيـة بـنـجـاح\n الـمـبـلـغ الـمـزال: ${dmt} ${global.moneda}\n الـمـسـتـخـدم: @${who.split('@')[0]}\n الـرصـيـد الـحـالـي: ${users[who].coin} ${global.moneda}\n الـمـشـرف: ${conn.getName(m.sender)}`)

m.reply(successText,null,{mentions:[who]})
}

handler.help=['removecoin <@user> <amount> - إزالة نقاط من مستخدم']
handler.tags=['مالك']
handler.command=['removecoin','ازالة_نقاط']
handler.rowner=true

export default handler