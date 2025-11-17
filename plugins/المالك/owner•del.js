let handler=async(m,{conn,usedPrefix,command,tr})=>{

let who=m.mentionedJid[0]?m.mentionedJid[0]:m.quoted?m.quoted.sender:false
if(!who)return conn.sendAllButtons({jid:m.chat,text:await tr(m,'🗑️*حذف مالك*\n\n📍*الاستخدام:*\n.delowner @منشن\n.delowner بالرد على رسالة\n\n⚠️*سيتم إزالة جميع الصلاحيات*'),title:"👑 نظام المالكين",footer:"انستازيا - نظام الصلاحيات",image:global.logo,buttons:[["📋 نسخ الأمر",".delowner @user"],["👥 عرض المالكين",".listowner"],["➕ إضافة مالك",".addowner"]]},m)

let numeroAEliminar=who
let index=global.owner.findIndex(owner=>owner[0]===numeroAEliminar)

if(index===-1)return conn.sendAllButtons({jid:m.chat,text:await tr(m,`❌*المستخدم غير موجود*\n📞*الرقم:*${numeroAEliminar.split('@')[0]}\n👑*الحالة:*ليس من المالكين`),title:"👑 نظام المالكين",footer:"انستازيا - نظام الصلاحيات",image:global.logo,buttons:[["➕ إضافة مالك",`.addowner @${numeroAEliminar.split('@')[0]}`],["👥 عرض المالكين",".listowner"],["🎪 القائمة الرئيسية",".menu"]]},m)

if(global.owner[index][0]==='201554680406@s.whatsapp.net')return conn.sendAllButtons({jid:m.chat,text:await tr(m,`⛔*غير مسموح*\n\nلا يمكن حذف المالك الأساسي\n👑*المالك:*🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑\n📞*الرقم:*201554680406`),title:"👑 نظام المالكين",footer:"انستازيا - نظام الصلاحيات",image:global.logo,buttons:[["👥 عرض المالكين",".listowner"],["➕ إضافة مالك",".addowner"],["⚡ تحديث البوت",".update"]]},m)

let deletedUser=global.owner[index]
let userName=await conn.getName(numeroAEliminar)
global.owner.splice(index,1)

conn.sendAllButtons({jid:m.chat,text:await tr(m,`✅*تم الحذف بنجاح*\n\n👤*المستخدم:*${userName}\n📞*الرقم:*${numeroAEliminar.split('@')[0]}\n👑*الصفة:*${deletedUser[1]||'مالك'}\n📊*عدد المالكين:*${global.owner.length}\n\n⚠️*الصلاحيات الملغاة:*\n• الوصول الكامل للأوامر\n• إدارة البوت\n• تعديل الإعدادات`),title:"🗑️ حذف مالك",footer:"انستازيا - نظام الصلاحيات",image:global.logo,buttons:[["➕ إضافة مالك",".addowner"],["👥 عرض المالكين",".listowner"],["⚙️ إعدادات البوت",".settings"]]},m)
}
handler.help=['delowner @user - حذف مالك']
handler.tags=['owner']
handler.command=['delowner','حذف_مالك']
handler.rowner=true
export default handler