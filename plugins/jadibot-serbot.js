/**
 * 🎯 أمر: إنشاء سيرفر بوت فرعي
 * 📍 الصلاحيات: جميع المستخدمين
 * 🌐 المدخل: كود QR أو نصي
 * 🎪 الفئة: سيرفرات
 * 👑 المالك: 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑
 */

const{useMultiFileAuthState,DisconnectReason,makeCacheableSignalKeyStore,fetchLatestBaileysVersion}=(await import("@whiskeysockets/baileys"))
import qrcode from"qrcode"
import NodeCache from"node-cache"
import fs from"fs"
import path from"path"
import pino from'pino'
import chalk from'chalk'
import{makeWASocket}from'../lib/simple.js'
import{fileURLToPath}from'url'

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

if(!global.conns)global.conns=[]

function isSubBotConnected(jid){return global.conns.some(sock=>sock?.user?.jid&&sock.user.jid.split("@")[0]===jid.split("@")[0])}

let handler=async(m,{conn,args,usedPrefix,command,isOwner,tr})=>{
if(!global.db.data.settings[conn.user.jid].jadibotmd)return m.reply(await tr(m,"هذا الأمر معطل حالياً"))

let time=global.db.data.users[m.sender].Subs+120000
if(new Date-global.db.data.users[m.sender].Subs<120000)return m.reply(await tr(m,`يجب الانتظار ${msToTime(time-new Date())} قبل إنشاء بوت فرعي جديد`))

let socklimit=global.conns.filter(sock=>sock?.user).length
if(socklimit>=50)return m.reply(await tr(m,"لا توجد مساحة متاحة للبوتات الفرعية"))

let mentionedJid=await m.mentionedJid
let who=mentionedJid&&mentionedJid[0]?mentionedJid[0]:m.fromMe?conn.user.jid:m.sender
let id=`${who.split`@`[0]}`
let pathshadowJadiBot=path.join(`./${jadi}/`,id)

if(!fs.existsSync(pathshadowJadiBot))fs.mkdirSync(pathshadowJadiBot,{recursive:true})

let shadowJBOptions={pathshadowJadiBot,m,conn,args,usedPrefix,command,fromCommand:true}
shadowJadiBot(shadowJBOptions)
global.db.data.users[m.sender].Subs=new Date*1
}

handler.help=['qr','code']
handler.tags=['serbot']
handler.command=['qr','code','بوت','سيرفر']
export default handler 

export async function shadowJadiBot(options){
let{pathshadowJadiBot,m,conn,args,usedPrefix,command}=options
const mcode=args[0]&&/(--code|code)/.test(args[0].trim())?true:args[1]&&/(--code|code)/.test(args[1].trim())?true:false

let txtCode,codeBot,txtQR
if(mcode){
args[0]=args[0].replace(/^--code$|^code$/,"").trim()
if(args[1])args[1]=args[1].replace(/^--code$|^code$/,"").trim()
if(args[0]=="")args[0]=undefined
}

const pathCreds=path.join(pathshadowJadiBot,"creds.json")
if(!fs.existsSync(pathshadowJadiBot))fs.mkdirSync(pathshadowJadiBot,{recursive:true})

try{
args[0]&&args[0]!=undefined?fs.writeFileSync(pathCreds,JSON.stringify(JSON.parse(Buffer.from(args[0],"base64").toString("utf-8")),null,'\t')):""
}catch{
conn.reply(m.chat,await tr(m,"استخدم الأمر بشكل صحيح"),m)
return
}

let{version}=await fetchLatestBaileysVersion()
const msgRetryCache=new NodeCache()
const{state,saveState,saveCreds}=await useMultiFileAuthState(pathshadowJadiBot)

const connectionOptions={
logger:pino({level:"fatal"}),
printQRInTerminal:false,
auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))},
msgRetryCache,
browser:['Windows','Firefox'],
version:version,
generateHighQualityLinkPreview:true
}

let sock=makeWASocket(connectionOptions)
sock.isInit=false
let isInit=true

setTimeout(async()=>{
if(!sock.user){
try{fs.rmSync(pathshadowJadiBot,{recursive:true,force:true})}catch{}
try{sock.ws?.close()}catch{}
sock.ev.removeAllListeners()
let i=global.conns.indexOf(sock)
if(i>=0)global.conns.splice(i,1)
console.log(`[تنظيف تلقائي] تم حذف بيانات الجلسة ${path.basename(pathshadowJadiBot)}`)
}},60000)

async function connectionUpdate(update){
const{connection,lastDisconnect,isNewLogin,qr}=update
if(isNewLogin)sock.isInit=false

if(qr&&!mcode){
if(m?.chat){
txtQR=await conn.sendMessage(m.chat,{image:await qrcode.toBuffer(qr,{scale:8}),caption:await tr(m,"*🎯 نظام البوت الفرعي - وضع QR*\n\n📱 بجهاز آخر أو على الكمبيوتر، امسح هذا QR لتصبح *بوت فرعي* مؤقت\n\n1 » انقر على النقاط الثلاث في الزاوية اليمنى العليا\n2 » اضغط على الأجهزة المرتبطة  \n3 » امسح هذا الرمز للاتصال بالبوت\n\n⏰ هذا الرمز ينتهي خلال 45 ثانية")},{quoted:m})
}
if(txtQR&&txtQR.key){
setTimeout(()=>{conn.sendMessage(m.sender,{delete:txtQR.key})},30000)
}
return
}

if(qr&&mcode){
let secret=await sock.requestPairingCode((m.sender.split`@`[0]))
secret=secret.match(/.{1,4}/g)?.join("-")
txtCode=await conn.sendMessage(m.chat,{text:await tr(m,"*🎯 نظام البوت الفرعي - وضع الكود*\n\n📱 استخدم هذا الكود لتصبح *بوت فرعي* مؤقت\n\n1 » انقر على النقاط الثلاث في الزاوية اليمنى العليا\n2 » اضغط على الأجهزة المرتبطة\n3 » اختر الربط برقم الهاتف\n4 » أدخل الكود للاتصال بالبوت\n\n⚠️ غير مستحب استخدام حسابك الرئيسي")},{quoted:m})
codeBot=await m.reply(secret)
console.log(secret)
}

if(txtCode&&txtCode.key){
setTimeout(()=>{conn.sendMessage(m.sender,{delete:txtCode.key})},30000)
}
if(codeBot&&codeBot.key){
setTimeout(()=>{conn.sendMessage(m.sender,{delete:codeBot.key})},30000)
}

const reason=lastDisconnect?.error?.output?.statusCode||lastDisconnect?.error?.output?.payload?.statusCode

if(connection==='close'){
if(reason===428){
console.log(chalk.bold.magentaBright(`\n┃ تم إغلاق الاتصال (+${path.basename(pathshadowJadiBot)}) بشكل غير متوقع. جاري إعادة الاتصال...`))
await creloadHandler(true).catch(console.error)
}
if(reason===408){
console.log(chalk.bold.magentaBright(`\n┃ فقدان الاتصال (+${path.basename(pathshadowJadiBot)})، السبب: ${reason}. جاري إعادة الاتصال...`))
await creloadHandler(true).catch(console.error)
}
if(reason===440){
console.log(chalk.bold.magentaBright(`\n┃ تم استبدال الاتصال (+${path.basename(pathshadowJadiBot)}) بجلسة نشطة أخرى.`))
try{
if(options.fromCommand)m?.chat?await conn.sendMessage(`${path.basename(pathshadowJadiBot)}@s.whatsapp.net`,{text:await tr(m,"⚠️ تم اكتشاف جلسة جديدة، احذف الجلسة القديمة للمتابعة")},{quoted:m||null}):""
}catch{console.error(chalk.bold.yellow(`⚠️ خطأ 440: لم نتمكن من إرسال رسالة إلى: +${path.basename(pathshadowJadiBot)}`))}
}
if(reason==405||reason==401){
console.log(chalk.bold.magentaBright(`\n┃ تم إغلاق الجلسة (+${path.basename(pathshadowJadiBot)}). بيانات غير صالحة أو تم فصل الجهاز يدوياً.`))
try{
if(options.fromCommand)m?.chat?await conn.sendMessage(`${path.basename(pathshadowJadiBot)}@s.whatsapp.net`,{text:await tr(m,"⚠️ جلسة معلقة. حاول الاتصال مرة أخرى لتصبح *بوت فرعي*")},{quoted:m||null}):""
}catch{console.error(chalk.bold.yellow(`⚠️ خطأ 405: لم نتمكن من إرسال رسالة إلى: +${path.basename(pathshadowJadiBot)}`))}
fs.rmdirSync(pathshadowJadiBot,{recursive:true})
}
if(reason===500){
console.log(chalk.bold.magentaBright(`\n┃ فقدان الاتصال في الجلسة (+${path.basename(pathshadowJadiBot)}). جاري حذف البيانات...`))
if(options.fromCommand)m?.chat?await conn.sendMessage(`${path.basename(pathshadowJadiBot)}@s.whatsapp.net`,{text:await tr(m,"⚠️ فقدان الاتصال. حاول الاتصال يدوياً لتصبح *بوت فرعي*")},{quoted:m||null}):""
return creloadHandler(true).catch(console.error)
}
if(reason===515){
console.log(chalk.bold.magentaBright(`\n┃ إعادة تشغيل تلقائي للجلسة (+${path.basename(pathshadowJadiBot)}).`))
await creloadHandler(true).catch(console.error)
}
if(reason===403){
console.log(chalk.bold.magentaBright(`\n┃ جلسة مغلقة أو الحساب في الدعم الفني للجلسة (+${path.basename(pathshadowJadiBot)}).`))
fs.rmdirSync(pathshadowJadiBot,{recursive:true})
}
}

if(global.db.data==null)loadDatabase()

if(connection==`open`){
if(!global.db.data?.users)loadDatabase()
await joinChannels(conn)
let userName,userJid 
userName=sock.authState.creds.me.name||'مجهول'
userJid=sock.authState.creds.me.jid||`${path.basename(pathshadowJadiBot)}@s.whatsapp.net`
console.log(chalk.bold.cyanBright(`\n┃ ${userName} (+${path.basename(pathshadowJadiBot)}) متصل بنجاح`))
sock.isInit=true
global.conns.push(sock)
m?.chat?await conn.sendMessage(m.chat,{text:isSubBotConnected(m.sender)?await tr(m,"أنت متصل بالفعل، جاري قراءة الرسائل الواردة..."):await tr(m,"🎯 تم تسجيل بوت فرعي جديد!\n\n> يمكنك رؤية معلومات البوت باستخدام الأمر *#معلومات_البوت*"),mentions:[m.sender]},{quoted:m}):''
}}

setInterval(async()=>{
if(!sock.user){
try{sock.ws.close()}catch(e){}
sock.ev.removeAllListeners()
let i=global.conns.indexOf(sock)
if(i<0)return
delete global.conns[i]
global.conns.splice(i,1)
}},60000)

let handler=await import('../handler.js')
let creloadHandler=async function(restatConn){
try{
const Handler=await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if(Object.keys(Handler||{}).length)handler=Handler
}catch(e){console.error('⚠️ خطأ جديد: ',e)}
if(restatConn){
const oldChats=sock.chats
try{sock.ws.close()}catch{}
sock.ev.removeAllListeners()
sock=makeWASocket(connectionOptions,{chats:oldChats})
isInit=true
}
if(!isInit){
sock.ev.off("messages.upsert",sock.handler)
sock.ev.off("connection.update",sock.connectionUpdate)
sock.ev.off('creds.update',sock.credsUpdate)
}
sock.handler=handler.handler.bind(sock)
sock.connectionUpdate=connectionUpdate.bind(sock)
sock.credsUpdate=saveCreds.bind(sock,true)
sock.ev.on("messages.upsert",sock.handler)
sock.ev.on("connection.update",sock.connectionUpdate)
sock.ev.on("creds.update",sock.credsUpdate)
isInit=false
return true
}
creloadHandler(false)
}

function msToTime(duration){
var milliseconds=parseInt((duration%1000)/100),
seconds=Math.floor((duration/1000)%60),
minutes=Math.floor((duration/(1000*60))%60),
hours=Math.floor((duration/(1000*60*60))%24)
hours=(hours<10)?'0'+hours:hours
minutes=(minutes<10)?'0'+minutes:minutes
seconds=(seconds<10)?'0'+seconds:seconds
return minutes+' دقيقة و '+seconds+' ثانية'
}

async function joinChannels(sock){
for(const value of Object.values(global.ch)){
if(typeof value==='string'&&value.endsWith('@newsletter')){
await sock.newsletterFollow(value).catch(()=>{})
}}}