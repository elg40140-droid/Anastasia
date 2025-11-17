/**
 * 🎯 أمر: إعادة تعيين البريفكس الافتراضي
 * 📍 الصلاحيات: المالك فقط
 * 🔧 الوظيفة: إعادة البريفكس للإعدادات الافتراضية
 * 🎪 الفئة: مالك
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

let handler=async(m,{conn,usedPrefix})=>{
try{
global.prefix=new RegExp('^['+('‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g,'\\$&')+']')

let successText=`تـم إعـادة تـعـيـين الـبـريـفـكـس\n الـبـريـفـكـس الـحـالـي: ${global.prefix}ـ`

await conn.fakeReply(m.chat,successText,'0@s.whatsapp.net','🎀 katty bot - rest to prifex new')

}catch(error){
console.error(error)
let errorText=`فـشـل فـي تـعـديـل الـبـريـفـكـس`
m.reply(errorText)
}
}

handler.command=['resetprefix','اعادة_البريفكس']
handler.help=['resetprefix - إعادة تعيين البريفكس الافتراضي']
handler.tags=['مالك','تحكم']
handler.rowner=true

export default handler