
let handler=async(m,{conn,usedPrefix,command,args,tr})=>{

let bot=global.db.data.settings[conn.user.jid]||{}
let action=args[0]?.toLowerCase()

if(!action||!['on','off','status','list','clear'].includes(action)){
let helpText=await tr(m,`نظام مراقبة الستوريات\n 📁 الأوامر المتاحة:\n ♡${usedPrefix}stories on♡ - تفعيل المراقبة\n ♡${usedPrefix}stories off♡ - إيقاف المراقبة\n ♡${usedPrefix}stories status♡ - حالة النظام\n ♡${usedPrefix}stories list♡ - عرض الستوريات\n ♡${usedPrefix}stories clear♡ - مسح الذاكرة\n الحالة الحالية: ${bot.monitorStories?'✅ مفعل':'❌ معطل'}`)
return m.reply(helpText)
}

switch(action){
case'on':
bot.monitorStories=true
m.reply(await tr(m,`تم التفعيل\n  النظام: مراقبة الستوريات\n الحالة: ✅ مفعل\n الوظيفة: توجيه الستوريات للمالك`))
break

case'off':
bot.monitorStories=false
m.reply(await tr(m,`تم الإيقاف\n النظام: مراقبة الستوريات\n الحالة: ❌ معطل\n الوظيفة: إيقاف التوجيه`))
break

case'status':
let status=bot.monitorStories?'✅ مفعل':'❌ معطل'
let count=conn.story?.length||0
m.reply(await tr(m,`حالة النظام\n النظام: مراقبة الستوريات\n الحالة: ${status}\n العدد: ${count} ستوري\n آخر تحديث: ${new Date().toLocaleString()}`))
break

case'list':
if(!conn.story||conn.story.length===0){
return m.reply(await tr(m,'❌ لا توجد ستوريات محفوظة'))
}
let listText='📸 *الستوريات المحفوظة:*\n\n'
conn.story.forEach((story,index)=>{
listText+=`${index+1}. ${story.sender} - ${story.type} - ${new Date(story.timestamp).toLocaleString()}\n`
})
m.reply(listText)
break

case'clear':
conn.story=[]
m.reply(await tr(m,'✅ تم مسح جميع الستوريات المحفوظة'))
break
}
}

handler.command=['stories','ستوريات']
handler.help=['stories <on/off/status/list/clear> - نظام مراقبة الستوريات']
handler.tags=['owner']
handler.owner=true

export default handler