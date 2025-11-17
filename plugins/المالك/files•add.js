import{promises as fs}from'fs'
import{join,dirname}from'path'
let handler=async(m,{conn,usedPrefix,args,command})=>{
if(!m.quoted||!m.quoted.text)return m.reply(`*⚠️ يرجى الرد على الكود لإضافة الأمر الجديد*`)
let filename=args[0]||`cmd-${Date.now()}.js`
let filepath=join(process.cwd(),...filename.split('/'))
let dir=dirname(filepath)
await fs.mkdir(dir,{recursive:true})
await fs.writeFile(filepath,m.quoted.text)
let successText=`*✅ تم الإضافة بنجاح*\n\n📄 *اسم الملف:* ${filename}\n📁 *المسار:* ${dirname(filepath).replace(process.cwd(),'')}\n💫 *الحالة:* تم الإنشاء بنجاح`
m.reply(successText)
}
handler.help=['- [اسم]']
handler.tags=['owner']
handler.command=['add','اضف']
handler.rowner=true
export default handler