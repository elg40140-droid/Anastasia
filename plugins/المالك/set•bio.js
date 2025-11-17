let handler=async(m,{conn,text,usedPrefix,command,tr})=>{
if(!global.owner.map(([number])=>number.replace(/[^0-9]/g,'')+'@s.whatsapp.net').includes(m.sender))return m.reply(await tr(m,'❌*هذا الأمر للمالك فقط!*'))
if(!text)return conn.sendAllButtons({jid:m.chat,text:await tr(m,'🎯*يرجى إدخال النص الجديد للبايو*\n\n💡*الأمثلة:*\n• كاتي بوت - البوت الذكي\n• تميز بالذكاء 🦋\n• الأنظمة المتقدمة'),title:"🔄 تغيير البايو",footer:"انستازيا - نظام الملفات المتقدم",image:global.logo,buttons:[["🎯 مثال 1",`.setbio كاتي بوت - البوت الذكي`],["✨ مثال 2",`.setbio تميز بالذكاء 🦋`],["⚡ مثال 3",`.setbio الأنظمة المتقدمة`]]},m)
try{
await conn.updateProfileStatus(text)
conn.sendAllButtons({jid:m.chat,text:await tr(m,`✅*تم تغيير البايو بنجاح*\n\n📝*البايو الجديد:*\n${text}`),title:"✅ تم التغيير",footer:"انستازيا - نظام الملفات المتقدم",image:global.logo,buttons:[["🔄 تغيير آخر",".setbio"],["👁️ مراقبة الملفات",".watch"],["📊 معلومات النظام",".system"]]},m)
}catch(e){
console.error(e)
m.reply(await tr(m,'❌*لم يتم تغيير البايو*'))
}
}
handler.command=['setbio','تغيير_البايو','البايو']
handler.help=['setbio <نص> - تغيير بايو البوت']
handler.tags=['مالك']
handler.rowner=true
export default handler