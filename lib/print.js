import{WAMessageStubType}from'@whiskeysockets/baileys'
import chalk from'chalk'
import{watchFile}from'fs'
const terminalImage=global.opts['img']?require('terminal-image'):''
const urlRegex=(await import('url-regex-safe')).default({strict:false})
export default async function(m,conn={user:{}}){
let _name=await conn.getName(m.sender)
let sender='+'+m.sender.replace('@s.whatsapp.net','')+(_name?' ~ '+_name:'')
let chat=await conn.getName(m.chat)
let img
try{
if(global.opts['img'])
img=/sticker|image/gi.test(m.mtype)?await terminalImage.buffer(await m.download()):false
}catch(e){console.error(e)}
let filesize=(m.msg?m.msg.vcard?m.msg.vcard.length:m.msg.fileLength?m.msg.fileLength.low||m.msg.fileLength:m.msg.axolotlSenderKeyDistributionMessage?m.msg.axolotlSenderKeyDistributionMessage.length:m.text?m.text.length:0:m.text?m.text.length:0)||0
let user=global.db.data.users[m.sender]
let me='+'+(conn.user?.jid||'').replace('@s.whatsapp.net','')
const userName=conn.user.name||conn.user.verifiedName||"غير معروف"
if(m.sender===conn.user?.jid)return
console.log(`${chalk.hex('#FE0041').bold('╭────────────────────────────────···')}
${chalk.hex('#FE0041').bold('│')}${chalk.redBright('البوت:')} ${chalk.greenBright(me)} ~ ${chalk.magentaBright(userName)} ${global.conn.user.jid===conn.user.jid?chalk.cyanBright('🔥 (رئيسي)'):chalk.cyanBright('(بوت فرعي)')}
${chalk.hex('#FE0041').bold('│')}${chalk.yellowBright('التاريخ:')} ${chalk.blueBright(new Date(m.messageTimestamp?1000*(m.messageTimestamp.low||m.messageTimestamp):Date.now()).toLocaleDateString("ar-EG",{timeZone:"Africa/Cairo",day:'numeric',month:'long',year:'numeric'}))}
${chalk.hex('#FE0041').bold('│')}${chalk.greenBright('نوع الحدث:')} ${chalk.redBright(m.messageStubType?WAMessageStubType[m.messageStubType]:'لا يوجد')}
${chalk.hex('#FE0041').bold('│')}${chalk.magentaBright('حجم الرسالة:')} ${chalk.yellowBright(filesize+' B')} [${chalk.cyanBright(filesize===0?0:(filesize/1000**Math.floor(Math.log(filesize)/Math.log(1000))).toFixed(1))} ${chalk.greenBright(['B','KB','MB','GB','TB'][Math.floor(Math.log(filesize)/Math.log(1000))]||'')}]
${chalk.hex('#FE0041').bold('│')}${chalk.blueBright('المرسل:')} ${chalk.redBright(sender)}
${chalk.hex('#FE0041').bold('│')}${chalk.cyanBright(`الدردشة ${m.isGroup?'جماعية':'خاصة'}:`)} ${chalk.greenBright(chat)}
${chalk.hex('#FE0041').bold('│')}${chalk.magentaBright('نوع الرسالة:')} ${chalk.yellowBright(m.mtype?m.mtype.replace(/message$/i,'').replace('audio',m.msg?.ptt?'صوت':'audio').replace(/^./,v=>v.toUpperCase()):'غير معروف')}
${chalk.hex('#FE0041').bold('╰───────────────────···')}`)
if(img)console.log(img.trimEnd())
if(typeof m.text==='string'&&m.text){
let log=m.text.replace(/\u200e+/g,'')
let mdRegex=/(?<=(?:^|[\s\n])\S?)(?:([*_~`])(?!`)(.+?)\1|```((?:.|[\n\r])+?)```|`([^`]+?)`)(?=\S?(?:[\s\n]|$))/g
let mdFormat=(depth=4)=>(_,type,text,monospace)=>{
let types={'_':'italic','*':'bold','~':'strikethrough','`':'bgGray'}
text=text||monospace
let formatted=!types[type]||depth<1?text:chalk[types[type]](text.replace(/`/g,'').replace(mdRegex,mdFormat(depth-1)))
return formatted}
log=log.replace(mdRegex,mdFormat(4))
log=log.split('\n').map(line=>{
if(line.trim().startsWith('>')){
return chalk.bgGray.dim(line.replace(/^>/,'┃'))
}else if(/^([1-9]|[1-9][0-9])\./.test(line.trim())){
return line.replace(/^(\d+)\./,(match,number)=>{
const padding=number.length===1?'  ':' '
return padding+number+'.'})
}else if(/^[-*]\s/.test(line.trim())){
return line.replace(/^[*-]/,'  •')}
return line}).join('\n')
if(log.length<1024)
log=log.replace(urlRegex,(url,i,text)=>{
let end=url.length+i
return i===0||end===text.length||(/^\s$/.test(text[end])&&/^\s$/.test(text[i-1]))?chalk.blueBright(url):url})
log=log.replace(mdRegex,mdFormat(4))
const testi=await m.mentionedJid
if(testi){
for(let user of testi)
log=log.replace('@'+user.split`@`[0],chalk.blueBright('@'+await conn.getName(user)))}
console.log(m.error!=null?chalk.red(log):m.isCommand?chalk.yellow(log):log)}
if(m.messageStubParameters){
console.log(m.messageStubParameters.map(jid=>{
jid=conn.decodeJid(jid)
let name=conn.getName(jid)
return chalk.gray('+'+jid.replace('@s.whatsapp.net','')+(name?' ~'+name:''))}).join(', '))}
if(/document/i.test(m.mtype))console.log(`🝮 ${m.msg.fileName||m.msg.displayName||'مستند'}`)
else if(/ContactsArray/i.test(m.mtype))console.log(`᯼ ${' '||''}`)
else if(/contact/i.test(m.mtype))console.log(`✎ ${m.msg.displayName||''}`)
else if(/audio/i.test(m.mtype)){
const duration=m.msg.seconds
console.log(`${m.msg.ptt?'☄ (صوت ':'𝄞 ('}صوت) ${Math.floor(duration/60).toString().padStart(2,0)}:${(duration%60).toString().padStart(2,0)}`)}
console.log()}
let file=global.__filename(import.meta.url)
watchFile(file,()=>{console.log(chalk.redBright("تحديث 'lib/print.js'"))})