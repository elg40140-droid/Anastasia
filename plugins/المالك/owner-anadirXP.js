/**
 * 🎯 أمر: إضافة نقاط خبرة للمستخدم
 * 📍 الصلاحيات: المالك فقط
 * 👥 المدخل: منشن المستخدم + عدد النقاط
 * 🎪 الفئة: تطوير
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

let handler=async(m,{conn,text,usedPrefix,command,tr})=>{
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

if(!who)return m.reply(await tr(m,`يـرجـى الـتـوجـيـه لـمـسـتـخـدم\n الـمـثـال: ${usedPrefix+command} @مستخدم 100\n أو: ${usedPrefix+command} 100 (بـالـتـوجـيـه)`))

const txt=text.replace('@'+who.split`@`[0],'').trim()
if(!txt)return m.reply(await tr(m,`يـرجـى إدخـال عـدد الـنـقـاط\n الـمـثـال: ${usedPrefix+command} @مستخدم 100\n الـعـدد: يـجـب أن يـكـون رقـمـاً صـحـيـحـاً`))

if(isNaN(txt))return m.reply(await tr(m,`رقـم غـيـر صـحـيـح\n يـجـب أن يـكـون الـمـدخـل رقـمـاً فـقـط\n مـثـال: 100, 500, 1000`))

const xp=parseInt(txt)
if(xp<1)return m.reply(await tr(m,`عـدد غـيـر مـسـمـوح\n أقـل عـدد مـسـمـوح بـه: 1 نـقـطـة\n الـعـدد الـذي أدخـلـتـه: ${xp}`))

const users=global.db.data.users
if(!users[who])users[who]={exp:0,coin:0,level:0}

const oldExp=users[who].exp||0
users[who].exp+=xp
const newExp=users[who].exp

const successText=await tr(m,`تـم إضـافـة الـنـقـاط بـنـجـاح\n الـمـسـتـخـدم: @${who.split('@')[0]}\n الـنـقـاط الـمـضـافـة: ${xp} نـقـطـة\n الـنـقـاط الـقـديمـة: ${oldExp} نـقـطـة\n الـنـقـاط الـجـديـدة: ${newExp} نـقـطـة\n الـمـجـمـوع: ${newExp-oldExp} نـقـطـة`)

m.reply(successText,{mentions:[who]})

}catch(error){
console.error(error)
m.reply(await tr(m,`حـدث خـطـأ\n الـسـبـب: خـطـأ فـي نـظـام الـقـاعـدة\n الـحـل: تـأكـد مـن صـحـة الـبـيـانـات`))
}
}

handler.command=['addexp','اضف_اكسبي']
handler.help=['addexp @المستخدم العدد - إضافة نقاط خبرة']
handler.tags=['تطوير','مالك']
handler.rowner=true

export default handler