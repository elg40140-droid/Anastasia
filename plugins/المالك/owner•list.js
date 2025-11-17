let handler=async(m,{conn,tr})=>{
let ownerList=global.owner.map((owner,index)=>{
let status=owner[2]?'✅':'⏸️'
let role=owner[1]||'مالك'
return`${index+1}. ${status} ${role} - ${owner[0].split('@')[0]}`
}).join('\n')

conn.sendAllButtons({jid:m.chat,text:await tr(m,`👑*قائمة المالكين*\n\n${ownerList}\n\n📊*الإجمالي:*${global.owner.length} مالك\n👑*المالك الأساسي:*🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑`),title:"👑 قائمة المالكين",footer:"انستازيا - نظام الصلاحيات",image:global.logo,buttons:[["➕ إضافة مالك",".addowner"],["🗑️ حذف مالك",".delowner"],["🔄 تحديث القائمة",".listowner"],["⚙️ إعدادات البوت",".settings"]]},m)
}
handler.help=['listowner - عرض قائمة المالكين']
handler.tags=['owner']
handler.command=['listowner','عرض_المالكين','المالكين']
handler.rowner=true
export default handler