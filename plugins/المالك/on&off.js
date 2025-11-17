let handler=async(m,{conn,args,usedPrefix,command,text,tr})=>{
let bot=global.db.data.settings[conn.user.jid]||{}
let[type,action]=text?text.trim().split(/\s+/):[]

const systems={
protection:{
antiPrivate:{name:'منع الخاص',desc:'منع استخدام البوت في الخاص',state:bot.antiPrivate?'✅ مفعل':'❌ معطل'},
antiSpam:{name:'منع السبام',desc:'حماية من الرسائل المزعجة',state:bot.antiSpam?'✅ مفعل':'❌ معطل'},
anticall:{name:'منع المكالمات',desc:'رفض المكالمات تلقائياً',state:bot.anticall?'✅ مفعل':'❌ معطل'}
},
general:{
self:{name:'وضع الخاص',desc:'وضع البرايفت',state:bot.self?'✅ مفعل':'❌ معطل'},
ngetik:{name:'مؤشر الكتابة',desc:'إظهار مؤشر الكتابة',state:bot.ngetik?'✅ مفعل':'❌ معطل'},
restrict:{name:'تقييد البوت',desc:'وضع التقييد',state:bot.restrict?'✅ مفعل':'❌ معطل'},
jadibotmd:{name:'وضع الجادي بوت',desc:'نظام الجادي بوت',state:bot.jadibotmd?'✅ مفعل':'❌ معطل'}
},
auto:{
autoread:{name:'قراءة الرسائل',desc:'علامة القراءة التلقائية',state:bot.autoread?'✅ مفعل':'❌ معطل'},
autoJoin:{name:'انضمام تلقائي',desc:'انضمام البوت للجروبات',state:bot.autoJoin?'✅ مفعل':'❌ معطل'},
autobio:{name:'البايو التلقائي',desc:'تغيير البايو تلقائياً',state:bot.autobio?'✅ مفعل':'❌ معطل'}
}
}

if(!type){
let currentSettings=[]
Object.keys(systems).forEach(category=>{
Object.keys(systems[category]).forEach(key=>{
let setting=systems[category][key]
currentSettings.push(`${setting.state} ${setting.name}`)
})
})

return conn.sendAllButtons({jid:m.chat,text:await tr(m,`*⚙️ إعدادات البوت المتقدمة*\n\n${currentSettings.join('\n')}\n\n📝 *الاستخدام:*\n♡.set النظام on/off♡\n♡.set القسم♡`),title:"⚙️ نظام الإعدادات",footer:"انستازيا - نظام التحكم المتقدم",image:global.logo,buttons:[["🛡️ إعدادات الحماية",`.set protection`],["⚙️ الإعدادات العامة",`.set general`],["🔄 الإعدادات التلقائية",`.set auto`]]},m)
}

if(systems[type]){
let categorySettings=systems[type]
let rows=Object.keys(categorySettings).map(key=>({title:`${categorySettings[key].state} ${categorySettings[key].name}`,description:`${categorySettings[key].desc} - ${bot[key]?'تعطيل':'تفعيل'}`,id:`.set ${key} ${bot[key]?'off':'on'}`}))

return conn.sendAllButtons({jid:m.chat,text:await tr(m,`*${getCategoryTitle(type)}*\n\nاختر النظام الذي تريد تعديله:\n💡 *انقر على أي نظام لتغيير حالته*`),title:getCategoryTitle(type),footer:"انستازيا - نظام الإعدادات",image:global.logo,buttons:[["🔙 الرجوع",`.set`],["🔄 التحديث",`.set ${type}`]],listButtons:[[getCategoryTitle(type),[{title:getCategoryTitle(type),rows}]]]},m)
}

let systemInfo=null
let categoryName=''
for(let category in systems){
if(systems[category][type]){
systemInfo=systems[category][type]
categoryName=category
break
}
}

if(!systemInfo)return conn.sendAllButtons({jid:m.chat,text:await tr(m,`*❌ نظام غير معروف*\n\nالنظام *${type}* غير موجود في القائمة.`),title:"❌ خطأ في النظام",footer:"انستازيا - نظام الإعدادات",image:global.logo,buttons:[["📋 عرض القائمة",`.set`],["🛡️ إعدادات الحماية",`.set protection`],["⚙️ الإعدادات العامة",`.set general`]]},m)

if(!action||!['on','off','enable','disable','تفعيل','تعطيل'].includes(action)){
let status=bot[type]?'✅ مفعل':'❌ معطل'
let actionButton=bot[type]?'تعطيل':'تفعيل'
return conn.sendAllButtons({jid:m.chat,text:await tr(m,`*${systemInfo.name}*\n\n📝 *الوصف:* ${systemInfo.desc}\n🎯 *الحالة:* ${status}\n📂 *القسم:* ${getCategoryTitle(categoryName)}\n\n🔧 *الاستخدام:*\n♡.set ${type} on♡ - للتشغيل\n♡.set ${type} off♡ - للإيقاف`),title:systemInfo.name,footer:"انستازيا - تعديل الإعدادات",image:global.logo,buttons:[[`🔄 ${actionButton}`,`.set ${type} ${bot[type]?'off':'on'}`],["📋 القائمة الرئيسية",`.set`],["🔄 التحديث",`.set ${type}`]]},m)
}

let enable=['on','enable','تفعيل'].includes(action.toLowerCase())
bot[type]=enable
let status=enable?'✅ تم التفعيل':'❌ تم الإيقاف'
let actionText=enable?'مفعل':'معطل'

conn.sendAllButtons({jid:m.chat,text:await tr(m,`*تم تحديث الإعدادات بنجاح* 🎉\n\n📝 *النظام:* ${systemInfo.name}\n🎯 *الحالة:* ${actionText}\n🔧 *الوصف:* ${systemInfo.desc}\n📂 *القسم:* ${getCategoryTitle(categoryName)}\n🌐 *النطاق:* البوت بالكامل`),title:"✅ تم التحديث",footer:"انستازيا - نظام الإعدادات",image:global.logo,buttons:[["🔄 عكس الإعداد",`.set ${type} ${enable?'off':'on'}`],["📋 المزيد من الإعدادات",`.set`],["🛡️ إعدادات الحماية",`.set protection`]]},m)
}

function getCategoryTitle(category){
const titles={
protection:'🛡️ إعدادات الحماية',
general:'⚙️ الإعدادات العامة', 
auto:'🔄 الإعدادات التلقائية'
}
return titles[category]||'الإعدادات'
}

handler.help=['set <option> <on/off> - إدارة إعدادات البوت']
handler.tags=['owner','system']
handler.command=['set','الاعدادات','اعدادات','settings']
handler.description='نظام إدارة إعدادات البوت المتقدم'
handler.owner=true
export default handler