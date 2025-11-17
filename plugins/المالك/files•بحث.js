import{promises as fs}from'fs'
import{join,relative}from'path'
let handler=async(m,{conn,args,usedPrefix})=>{
if(!args[0])return conn.sendAllButtons({jid:m.chat,text:'🔍*يرجى كتابة كلمة البحث*\n\n💡*مثال:*\n.search console.log\n.search function',title:"🔍 نظام البحث",footer:"انستازيا - نظام الملفات المتقدم",image:global.logo,buttons:[["🎯 بحث سريع",".search function"],["🔧 بحث الأدوات",".search handler"],["📦 بحث الاستيرادات",".search import"]]},m)
let searchTerm=args[0]
let searchType=args[1]||'text'
let startTime=Date.now()
await m.reply(`🔍*جاري البحث عن "*${searchTerm}"*...*`)
let results=[]
async function searchDirectory(path){
try{
let items=await fs.readdir(path,{withFileTypes:true})
for(let item of items){
let fullPath=join(path,item.name)
if(item.isDirectory()){
if(!item.name.startsWith('.')&&item.name!=='node_modules'){
await searchDirectory(fullPath)
}
}else if(item.isFile()&&isSearchableFile(item.name)){
try{
let content=await fs.readFile(fullPath,'utf8')
let searcher=searchType==='regex'?content=>new RegExp(searchTerm,'i').test(content):content=>content.toLowerCase().includes(searchTerm.toLowerCase())
if(searcher(content)){
let matches=content.split('\n').map((line,index)=>({line:index+1,content:line})).filter(({content})=>searcher(content))
results.push({path:fullPath,matches})
}
}catch(e){}
}
}
}catch(error){}
}
function isSearchableFile(filename){
let allowedExt=['.js','.mjs','.json','.txt','.md','.html','.css']
return allowedExt.some(ext=>filename.endsWith(ext))
}
await searchDirectory(process.cwd())
let searchTime=Date.now()-startTime
if(results.length===0){
return conn.sendAllButtons({jid:m.chat,text:`🔍*لم يتم العثور على نتائج لـ "*${searchTerm}"*"*\n\n💡*جرب:*\n• استخدام كلمات مختلفة\n• التأكد من الإملاء\n• استخدام .search help للمساعدة`,title:"🔍 نتائج البحث",footer:"انستازيا - نظام الملفات المتقدم",image:global.logo,buttons:[["🔄 بحث جديد",".search"],["🎯 أمثلة بحث",".search examples"],["📖 المساعدة",".help"]]},m)
}
let resultText=`🔍*نتائج البحث عن "*${searchTerm}"*"\n📊*النتائج:*${results.length}ملف\n⏱️*الوقت:*${searchTime}مللي ثانية\n\n`
results.slice(0,5).forEach((result,index)=>{
let relativePath=relative(process.cwd(),result.path)
resultText+=`📌*${index+1}.${relativePath}*\n`
result.matches.slice(0,2).forEach(match=>{
resultText+=`📍السطر${match.line}:${match.content.trim().slice(0,40)}...\n`
})
resultText+='\n'
})
if(results.length>5){
resultText+=`🎯*و${results.length-5}نتيجة إضافية...*`
}
conn.sendAllButtons({jid:m.chat,text:resultText,title:"🔍 نتائج البحث",footer:"انستازيا - نظام الملفات المتقدم",image:global.logo,buttons:[["📁 عرض الملفات",".files"],["👁️ مراقبة التغييرات",".watch"],["🔄 بحث متقدم",`.search ${searchTerm} regex`]]},m)
}
handler.help=['- [term]']
handler.tags=['owner']
handler.command=['search','بحث']
handler.rowner=true
export default handler