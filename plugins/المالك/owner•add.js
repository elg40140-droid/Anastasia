let handler=async(m,{conn,usedPrefix,command,tr})=>{

let who=m.mentionedJid[0]?m.mentionedJid[0]:m.quoted?m.quoted.sender:false
if(!who)return conn.sendAllButtons({jid:m.chat,text:await tr(m,'👑*إضافة مالك جديد*\n\n📍*الاستخدام:*\n.addowner @منشن\n.addowner بالرد على رسالة\n\n🎯*سيتم منح الصلاحيات الكاملة للبوت*'),title:"👑 نظام المالكين",footer:"انستازيا - نظام الصلاحيات",image:global.logo,buttons:[["📋 نسخ الأمر",".addowner @user"],["👥 عرض المالكين",".listowner"],["🎪 القائمة الرئيسية",".menu"]]},m)

let nuevoNumero=who
let exists=global.owner.some(owner=>owner[0]===nuevoNumero)
if(exists)return conn.sendAllButtons({jid:m.chat,text:await tr(m,`❌*المستخدم موجود مسبقاً*\n📞*الرقم:*${nuevoNumero.split('@')[0]}\n👑*الحالة:*مالك بالفعل`),title:"👑 نظام المالكين",footer:"انستازيا - نظام الصلاحيات",image:global.logo,buttons:[["🗑️ حذف المالك",`.delowner @${nuevoNumero.split('@')[0]}`],["👥 عرض المالكين",".listowner"],["🔄 تحديث القائمة",".ownerlist"]]},m)

global.owner.push([nuevoNumero,'مالك جديد',true])
let userInfo=await conn.fetchStatus(nuevoNumero).catch(()=>({status:'غير متوفر'}))
let userName=await conn.getName(nuevoNumero)

conn.sendAllButtons({jid:m.chat,text:await tr(m,`✅*تمت الإضافة بنجاح*\n\n👤*المستخدم:*${userName}\n📞*الرقم:*${nuevoNumero.split('@')[0]}\n📝*الحالة:*${userInfo.status||'غير متوفر'}\n👑*الصفة:*مالك جديد\n📊*عدد المالكين:*${global.owner.length}\n\n🎯*الصلاحيات الممنوحة:*\n• الوصول الكامل للأوامر\n• إدارة البوت كاملاً\n• تعديل الإعدادات`),title:"👑 إضافة مالك",footer:"انستازيا - نظام الصلاحيات",image:global.logo,buttons:[["📞 نسخ الرقم","copy_owner_number",nuevoNumero.split('@')[0]],["👥 عرض المالكين",".listowner"],["🗑️ حذف مالك",".delowner"],["⚙️ إعدادات البوت",".settings"]]},m)
}
handler.help=['addowner @user - إضافة مالك جديد']
handler.tags=['owner']
handler.command=['addowner','اضف_مالك']
handler.rowner=true
export default handler