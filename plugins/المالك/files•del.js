import{promises as fs}from'fs'
import{join}from'path'
let handler=async(m,{conn,usedPrefix,args,command})=>{
if(!args[0])return m.reply(`*⚠️ يرجى كتابة اسم الملف للحذف*`)
let filepath=join(process.cwd(),...args[0].split('/'))
await fs.unlink(filepath)
let deleteText=`*🗑️ تم الحذف بنجاح*\n\n📄 *الملف:* ${args[0]}\n⏰ *الوقت:* ${new Date().toLocaleString()}\n💫 *الحالة:* تم الحذف نهائياً`
m.reply(deleteText)
}
handler.help=['- [اسم]']
handler.tags=['owner']
handler.command=['del','امسح']
handler.rowner=true
export default handler