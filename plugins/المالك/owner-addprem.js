/**
 * 🎯 أمر: إدارة العضوية المميزة
 * 📍 الصلاحيات: المالك فقط
 * 🌐 المدخل: منشن + وقت (1h, 2d, 3s, 4m)
 * 🎪 الفئة: مالك
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

let handler=async(m,{conn,command,text,usedPrefix,tr})=>{
let who
if(m.isGroup)who=m.mentionedJid[0]?m.mentionedJid[0]:m.quoted?m.quoted.sender:false
else who=m.chat

if(!who)return m.reply(await tr(m,`يـرجـى الـمـنـشـن أو الـرد عـلـى الـمـسـتـخـدم\n الـمـثـال: ${usedPrefix+command} @منشن 1 d\n أو: ${usedPrefix+command} بالرد 2 h`))

const user=global.db.data.users[who]
const now=Date.now()

try{
switch(command){
case'addprem':
case'addpremium':
case'اضف_مميز':
const args=text.split(' ').filter(arg=>arg)
let tiempo=0

if(args.length<2)return m.reply(await tr(m,`يـرجـى إدخـال وقـت صـحـيح\n الـمـثـال: ${usedPrefix+command} @منشن 1 h\n أو: ${usedPrefix+command} بالرد 2 d\n`))

if(args[1]==='h'){
tiempo=3600000*parseInt(args[0])
}else if(args[1]==='d'){
tiempo=86400000*parseInt(args[0])
}else if(args[1]==='s'){
tiempo=604800000*parseInt(args[0])
}else if(args[1]==='m'){
tiempo=2592000000*parseInt(args[0])
}else{
return m.reply(await tr(m,`وقـت غـيـر صـحـيح\n الـخـيـارات الـمـتـاحـة:\n *h :* سـاعـات\n *d :* أيـام\n *s :* أسـابـيـع\n *m :* شـهـور\n 📝 أمـثـلـة:\n ${usedPrefix+command} @منشن 1 h ← سـاعـة واحـدة\n ${usedPrefix+command} بالرد 2 d ← يـومـيـن\n ${usedPrefix+command} @منشن 1 s ← أسـبـوع\n ${usedPrefix+command} بالرد 1 m ← شـهـر`))
}

if(now<user.premiumTime)user.premiumTime+=tiempo
else user.premiumTime=now+tiempo

user.premium=true
const timeLeft=await formatTime(user.premiumTime-now)
const successText=await tr(m,`تـمـت الإضـافـة بـنـجـاح\n الـمـسـتـخـدم: @${who.split`@`[0]}\n الـوقـت: ${args[0]}${args[1]}\n الـمـتـبـقـي: ${timeLeft}\n الـحـالـة: عـضـو مـمـيـز`)
m.reply(successText,null,{mentions:[who]})
break

case'delprem':
case'delpremium':
case'حذف_مميز':
if(user.premiumTime===0)throw await tr(m,`الـمـسـتـخـدم لـيـس عـضـوًا مـمـيـزًا\n الـمـسـتـخـدم: @${who.split`@`[0]}\n لا يـمـتـلـك عـضـويـة مـمـيـزة`)
user.premiumTime=0
user.premium=false
const removeText=await tr(m,`تـم الـحـذف بـنـجـاح\n الـمـسـتـخـدم: @${who.split`@`[0]}\n الـحـالـة: لـيـس عـضـوًا مـمـيـزًا\n تـم إزالـة جـمـيـع الـمـمـيـزات`)
m.reply(removeText,null,{mentions:[who]})
break

default:
m.reply(await tr(m,`أمـر غـيـر مـعـروف\n الأمـر: ${command}\n لـيـس أمـرًا صـحـيـحًا`))
}
}catch(error){
console.error(error)
m.reply(await tr(m,`حـدث خـطـأ\n الـسـبـب: ${error.message}\n الـحـل: تـأكـد مـن الـبـيـانـات وجـرب مـرة أخـرى`))
}
}

handler.command=['addprem','اضف_مميز','delprem','حذف_مميز']
handler.help=['addprem <@منشن/بالرد> <وقت> - إضافة عضوية مميزة']
handler.tags=['مالك']
handler.rowner=true

export default handler

async function formatTime(ms){
let seconds=Math.floor(ms/1000)
let minutes=Math.floor(seconds/60)
let hours=Math.floor(minutes/60)
const days=Math.floor(hours/24)
seconds%=60
minutes%=60
hours%=24
let timeString=''

if(days){
timeString+=`${days} يـوم${days>1?'ـيـن':''} `
}
if(hours){
timeString+=`${hours} سـاعـة${hours>1?'ـتـيـن':''} `
}
if(minutes){
timeString+=`${minutes} دقـيـقـة${minutes>1?'ـتـيـن':''} `
}
if(seconds){
timeString+=`${seconds} ثـانـيـة${seconds>1?'ـتـيـن':''} `
}
return timeString.trim()
}