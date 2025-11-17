process.env['NODE_TLS_REJECT_UNAUTHORIZED']='1'
import'./settings.js'
import{watchFile,unwatchFile}from'fs'
import{createRequire}from'module'
import{fileURLToPath,pathToFileURL}from'url'
import{platform}from'process'
import*as ws from'ws'
import fs,{readdirSync,statSync,unlinkSync,existsSync,mkdirSync,readFileSync,rmSync,watch}from'fs'
import{spawn}from'child_process'
import lodash from'lodash'
import chalk from'chalk'
import syntaxerror from'syntax-error'
import{tmpdir}from'os'
import{format}from'util'
import P from'pino'
import path,{join,dirname}from'path'
import{Boom}from'@hapi/boom'
import{makeWASocket,protoType,serialize}from'./lib/simple.js'
import{Low,JSONFile}from'lowdb'
import{mongoDB,mongoDBV2}from'./lib/mongoDB.js'
import store from'./lib/store.js'
const{proto}=(await import('@whiskeysockets/baileys')).default
import pkg from'google-libphonenumber'
const{PhoneNumberUtil}=pkg
const phoneUtil=PhoneNumberUtil.getInstance()
const{DisconnectReason,useMultiFileAuthState,MessageRetryMap,fetchLatestBaileysVersion,makeCacheableSignalKeyStore,jidNormalizedUser,Browsers}=await import('@whiskeysockets/baileys')
import NodeCache from'node-cache'
const{CONNECTING}=ws
const{chain}=lodash
const PORT=process.env.PORT||process.env.SERVER_PORT||3000

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))
protoType()
serialize()

global.__filename=function filename(pathURL=import.meta.url,rmPrefix=platform!=='win32'){
return rmPrefix?/file:\/\/\//.test(pathURL)?fileURLToPath(pathURL):pathURL:pathToFileURL(pathURL).toString()}
global.__dirname=function dirname(pathURL){return path.dirname(global.__filename(pathURL,true))}
global.__require=function require(dir=import.meta.url){return createRequire(dir)}

global.API=(name,path='/',query={},apikeyqueryname)=>(name in global.APIs?global.APIs[name]:name)+path+(query||apikeyqueryname?'?'+new URLSearchParams(Object.entries({...query,...(apikeyqueryname?{[apikeyqueryname]:global.APIKeys[name in global.APIs?global.APIs[name]:name]}:{})})):'')

global.timestamp={start:new Date}
const __dirname=global.__dirname(import.meta.url)

global.opts=Object.fromEntries(process.argv.slice(2).map(arg=>{const[key,value]=arg.split('=');return[key,value||true]}))
global.prefix=new RegExp('^[#/!.]')

global.db=new Low(/https?:\/\//.test(opts['db']||'')?new cloudDBAdapter(opts['db']):new JSONFile('./database.json'))

global.DATABASE=global.db
global.loadDatabase=async function loadDatabase(){
if(global.db.READ){return new Promise((resolve)=>setInterval(async function(){
if(!global.db.READ){clearInterval(this)
resolve(global.db.data==null?global.loadDatabase():global.db.data)}},1*1000))}
if(global.db.data!==null)return
global.db.READ=true
await global.db.read().catch(console.error)
global.db.READ=null
global.db.data={users:{},chats:{},stats:{},msgs:{},sticker:{},settings:{},...(global.db.data||{}),}
global.db.chain=chain(global.db.data)}
loadDatabase()

const{state,saveState,saveCreds}=await useMultiFileAuthState(global.sessions)
const msgRetryCounterMap=(MessageRetryMap)=>{}
const msgRetryCounterCache=new NodeCache()
const{version}=await fetchLatestBaileysVersion()
let phoneNumber=global.botNumber
const methodCodeQR=process.argv.includes("qr")
const methodCode=!!phoneNumber||process.argv.includes("code")
const MethodMobile=process.argv.includes("mobile")

console.info=()=>{}
console.debug=()=>{}
const connectionOptions={logger:pino({level:'silent'}),printQRInTerminal:methodCodeQR?true:false,mobile:MethodMobile,browser:Browsers.macOS("Desktop"),auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,P({level:"fatal"}).child({level:"fatal"})),},markOnlineOnConnect:true,generateHighQualityLinkPreview:true,autoTyping:true,readGroup:true,readPrivate:true,syncFullHistory:false,downloadHistory:false,getMessage:async(clave)=>{let jid=jidNormalizedUser(clave.remoteJid)
let msg=await store.loadMessage(jid,clave.id)
return msg?.message||""},msgRetryCounterCache,msgRetryCounterMap,defaultQueryTimeoutMs:undefined,version}

global.conn=makeWASocket(connectionOptions)
if(!fs.existsSync(`./${global.sessions}/creds.json`)&&global.botNumber){
console.log(chalk.bold.cyan('🔐 جاري الاتصال برقم البوت...'))
setTimeout(async()=>{
let codeBot=await conn.requestPairingCode(global.botNumber.replace(/[^0-9]/g,''))
codeBot=codeBot?.match(/.{1,4}/g)?.join('-')||codeBot
console.log(chalk.bold.green(`📱 كود البايرنج: ${codeBot}\n🎯 أدخل الكود في تطبيق الواتساب`))},2000)}

conn.isInit=false
conn.well=false
if(!opts['test']){
if(global.db)setInterval(async()=>{
if(global.db.data)await global.db.write()
if(opts['autocleartmp']&&(global.support||{}).find)(tmp=[tmpdir(),'tmp',`${global.jadi}`],tmp.forEach((filename)=>cp.spawn('find',[filename,'-amin','3','-type','f','-delete'])))},30*1000)}

async function connectionUpdate(update){
const{connection,lastDisconnect,isNewLogin}=update
global.stopped=connection
if(isNewLogin)conn.isInit=true
const code=lastDisconnect?.error?.output?.statusCode||lastDisconnect?.error?.output?.payload?.statusCode
if(code&&code!==DisconnectReason.loggedOut&&conn?.ws.socket==null){
await global.reloadHandler(true).catch(console.error)
global.timestamp.connect=new Date}
if(global.db.data==null)loadDatabase()
if(update.qr!=0&&update.qr!=undefined||methodCodeQR){
if(methodCodeQR){console.log(chalk.bold.yellow(`\n📱 امسح رمز QR قبل انتهاء صلاحيته`))}}
if(connection=='open'){console.log(chalk.bold.green('\n✅ انستازيا متصلة وجاهزة!'))}
let reason=new Boom(lastDisconnect?.error)?.output?.statusCode
if(connection==='close'){
if(reason===DisconnectReason.badSession){
console.log(chalk.bold.cyan(`\n🔄 جلسة منتهية، جاري إعادة التوصيل...`))
await global.reloadHandler(true).catch(console.error)
}else if(reason===DisconnectReason.connectionClosed){
console.log(chalk.bold.magenta(`\n🔁 تم إغلاق الاتصال، جاري إعادة التوصيل...`))
await global.reloadHandler(true).catch(console.error)
}else if(reason===DisconnectReason.connectionLost){
console.log(chalk.bold.blue(`\n🌐 انقطع الاتصال، جاري إعادة التوصيل...`))
await global.reloadHandler(true).catch(console.error)
}else if(reason===DisconnectReason.connectionReplaced){
console.log(chalk.bold.yellow(`\n⚠️ تم استبدال الاتصال بجلسة جديدة`))
}else if(reason===DisconnectReason.loggedOut){
console.log(chalk.bold.red(`\n🔒 تم تسجيل الخروج، جاري إعادة التوصيل...`))
await global.reloadHandler(true).catch(console.error)
}else if(reason===DisconnectReason.restartRequired){
console.log(chalk.bold.cyan(`\n🔄 جاري إعادة التشغيل...`))
await global.reloadHandler(true).catch(console.error)
}else if(reason===DisconnectReason.timedOut){
console.log(chalk.bold.yellow(`\n⏰ انتهت مهلة الاتصال، جاري إعادة التوصيل...`))
await global.reloadHandler(true).catch(console.error)
}else{console.log(chalk.bold.red(`\n❌ خطأ غير معروف: ${reason}`))}}}
process.on('uncaughtException',console.error)

let isInit=true
let handler=await import('./handler.js')
global.reloadHandler=async function(restatConn){
try{const Handler=await import(`./handler.js?update=${Date.now()}`).catch(console.error)
if(Object.keys(Handler||{}).length)handler=Handler}catch(e){console.error(e)}
if(restatConn){
const oldChats=global.conn.chats
try{global.conn.ws.close()}catch{}
conn.ev.removeAllListeners()
global.conn=makeWASocket(connectionOptions,{chats:oldChats,retryRequestDelayMs:10000,maxRetries:3})
isInit=true}
if(!isInit){
conn.ev.off('messages.upsert',conn.handler)
conn.ev.off('connection.update',conn.connectionUpdate)
conn.ev.off('creds.update',conn.credsUpdate)}
conn.handler=handler.handler?handler.handler.bind(conn):conn.handler
conn.connectionUpdate=connectionUpdate.bind(global.conn)
conn.credsUpdate=saveCreds.bind(global.conn,true)
conn.ev.on('messages.upsert',async(m)=>{if(m.messages&&m.messages[0]&&m.messages[0].key&&m.messages[0].key.remoteJid){const jid=m.messages[0].key.remoteJid
await conn.sendPresenceUpdate('composing',jid)
await conn.handler(m)
await conn.readMessages([m.messages[0].key])
await conn.sendPresenceUpdate('paused',jid)}})
conn.ev.on('connection.update',conn.connectionUpdate)
conn.ev.on('creds.update',conn.credsUpdate)
isInit=false
return true}

global.rutaJadiBot=join(__dirname,'./JadiBots')
if(global.yukiJadibts){
if(!existsSync(global.rutaJadiBot)){mkdirSync(global.rutaJadiBot,{recursive:true})
console.log(chalk.bold.cyan(`📁 تم إنشاء مجلد ${global.jadi}`))}else{console.log(chalk.bold.cyan(`📁 مجلد ${global.jadi} موجود`))}
const readRutaJadiBot=readdirSync(global.rutaJadiBot)
if(readRutaJadiBot.length>0){const creds='creds.json'
for(const gjbts of readRutaJadiBot){const botPath=join(global.rutaJadiBot,gjbts)
const readBotPath=readdirSync(botPath)
if(readBotPath.includes(creds)){yukiJadiBot({pathYukiJadiBot:botPath,m:null,conn,args:'',usedPrefix:'/',command:'serbot'})}}}}

// 🆕 نظام مراقبة الملفات المتقدم
const watchedFiles=new Map()
const pluginExtensions=/\.(js|mjs|cjs|ts)$/i

async function loadAllFiles(dir=__dirname,baseDir=__dirname){
let loaded=[]
try{const items=readdirSync(dir,{withFileTypes:true})
for(const item of items){const fullPath=join(dir,item.name)
if(item.isDirectory()&&!item.name.startsWith('.')&&item.name!=='node_modules'){loaded=loaded.concat(await loadAllFiles(fullPath,baseDir))}
else if(item.isFile()&&pluginExtensions.test(item.name)){try{const relPath=path.relative(baseDir,fullPath).replace(/\\/g,'/')
const module=await import(pathToFileURL(fullPath).href)
global.plugins[relPath]=module.default||module
loaded.push(relPath)
console.log(chalk.bold.green(`✅ ${relPath}`))}catch(e){console.error(chalk.bold.red(`❌ ${fullPath}: ${e.message}`))}}}
return loaded}catch(err){console.error(chalk.bold.red(`📁 خطأ في ${dir}:`,err))
return[]}}

async function setupFileWatcher(dir=__dirname){
const watchHandler=async(eventType,filename)=>{
if(!filename)return
const fullPath=join(dir,filename)
const relPath=path.relative(__dirname,fullPath).replace(/\\/g,'/')
if(pluginExtensions.test(filename)){
if(eventType==='change'){console.log(chalk.bold.blue(`🔄 تحديث ${relPath}`))
try{const code=readFileSync(fullPath,'utf-8')
const err=syntaxerror(code,filename,{sourceType:'module',allowAwaitOutsideFunction:true})
if(err){console.error(chalk.bold.red(`❌ خطأ في ${filename}\n${format(err)}`))}else{const module=await import(pathToFileURL(fullPath).href+`?update=${Date.now()}`)
global.plugins[relPath]=module.default||module
console.log(chalk.bold.green(`✅ تم تحديث ${relPath}`))}}catch(e){console.error(chalk.bold.red(`❌ خطأ في تحديث ${relPath}:`,e))}}
else if(eventType==='rename'){if(existsSync(fullPath)){console.log(chalk.bold.green(`🆕 ملف جديد ${relPath}`))
try{const module=await import(pathToFileURL(fullPath).href)
global.plugins[relPath]=module.default||module}catch(e){console.error(chalk.bold.red(`❌ خطأ في تحميل ${relPath}:`,e))}}else{console.log(chalk.bold.yellow(`🗑️ حذف ${relPath}`))
delete global.plugins[relPath]}}}}
try{const watcher=watch(dir,{recursive:true},watchHandler)
watchedFiles.set(dir,watcher)
console.log(chalk.bold.cyan(`👁️ مراقبة ${dir}`))
const items=readdirSync(dir,{withFileTypes:true})
for(const item of items){if(item.isDirectory()&&!item.name.startsWith('.')&&item.name!=='node_modules'){await setupFileWatcher(join(dir,item.name))}}}catch(err){console.error(chalk.bold.red(`❌ خطأ في مراقبة ${dir}:`,err))}}

global.plugins={}
console.log(chalk.bold.cyan('📂 جاري تحميل جميع الملفات...'))
const loadedFiles=await loadAllFiles()
global.plugins=Object.fromEntries(Object.entries(global.plugins).sort(([a],[b])=>a.localeCompare(b)))
console.log(chalk.bold.green(`🎉 تم تحميل ${loadedFiles.length} ملف`))

await setupFileWatcher()

global.reload=async(_ev,filename)=>{
if(!filename)return
const rel=filename.replace(/\\/g,'/')
if(!pluginExtensions.test(rel))return
const absolutePath=join(__dirname,rel)
const key=path.relative(__dirname,absolutePath).replace(/\\/g,'/')
if(key in global.plugins){
if(existsSync(absolutePath)){console.log(chalk.bold.blue(`🔄 تحديث ${key}`))
try{const code=readFileSync(absolutePath,'utf-8')
const err=syntaxerror(code,key,{sourceType:'module',allowAwaitOutsideFunction:true})
if(err){console.error(chalk.bold.red(`❌ خطأ في ${key}\n${format(err)}`))}else{const module=await import(pathToFileURL(absolutePath).href+`?update=${Date.now()}`)
global.plugins[key]=module.default||module}}catch(e){console.error(chalk.bold.red(`❌ خطأ في ${key}:`,e))}}else{console.log(chalk.bold.yellow(`🗑️ حذف ${key}`))
delete global.plugins[key]}}else{console.log(chalk.bold.green(`🆕 ملف جديد ${key}`))
try{const module=await import(pathToFileURL(absolutePath).href)
global.plugins[key]=module.default||module}catch(e){console.error(chalk.bold.red(`❌ خطأ في ${key}:`,e))}}}
Object.freeze(global.reload)

await global.reloadHandler()

async function _quickTest(){
const test=await Promise.all([spawn('ffmpeg'),spawn('ffprobe'),spawn('ffmpeg',['-hide_banner','-loglevel','error','-filter_complex','color','-frames:v','1','-f','webp','-']),spawn('convert'),spawn('magick'),spawn('gm'),spawn('find',['--version'])].map((p)=>{return Promise.race([new Promise((resolve)=>{p.on('close',(code)=>{resolve(code!==127)})}),new Promise((resolve)=>{p.on('error',(_)=>resolve(false))})])}))
const[ffmpeg,ffprobe,ffmpegWebp,convert,magick,gm,find]=test
const s=global.support={ffmpeg,ffprobe,ffmpegWebp,convert,magick,gm,find}
Object.freeze(global.support)}
_quickTest().then(()=>console.log(chalk.bold.green('✅ البوت جاهز!'))).catch(console.error)

function clearTmp(){const tmpDir=join(__dirname,'tmp')
if(existsSync(tmpDir)){const filenames=readdirSync(tmpDir)
filenames.forEach(file=>{const filePath=join(tmpDir,file)
unlinkSync(filePath)})}}

function purgeSession(){let prekey=[];let directorio=readdirSync(`./${global.sessions}`)
let filesFolderPreKeys=directorio.filter(file=>file.startsWith('pre-key-'))
prekey=[...prekey,...filesFolderPreKeys]
filesFolderPreKeys.forEach(files=>{unlinkSync(`./${global.sessions}/${files}`)})}

function purgeSessionSB(){try{const listaDirectorios=readdirSync(`./${global.jadi}/`)
let SBprekey=[];listaDirectorios.forEach(directorio=>{if(statSync(`./${global.jadi}/${directorio}`).isDirectory()){const DSBPreKeys=readdirSync(`./${global.jadi}/${directorio}`).filter(fileInDir=>fileInDir.startsWith('pre-key-'))
SBprekey=[...SBprekey,...DSBPreKeys];DSBPreKeys.forEach(fileInDir=>{if(fileInDir!=='creds.json'){unlinkSync(`./${global.jadi}/${directorio}/${fileInDir}`)}})} })
if(SBprekey.length===0){console.log(chalk.bold.green(`\n📁 ${global.jadi}: لا يوجد ملفات للحذف`))}else{console.log(chalk.bold.cyan(`\n🧹 ${global.jadi}: تم تنظيف الملفات`))}}catch(err){console.log(chalk.bold.red(`\n❌ خطأ في ${global.jadi}:`,err))}}

setInterval(async()=>{
if(global.stopped==='close'||!conn||!conn.user)return
await clearTmp()
console.log(chalk.bold.cyan('🧹 تم تنظيف الملفات المؤقتة'))},1000*60*4)

setInterval(async()=>{
if(global.stopped==='close'||!conn||!conn.user)return
await purgeSession()
console.log(chalk.bold.cyan('🔄 تم تنظيف الجلسات'))},1000*60*10)

setInterval(async()=>{
if(global.stopped==='close'||!conn||!conn.user)return
await purgeSessionSB()},1000*60*10)

async function isValidPhoneNumber(number){
try{number=number.replace(/\s+/g,'')
if(number.startsWith('+521')){number=number.replace('+521','+52')}else if(number.startsWith('+52')&&number[4]==='1'){number=number.replace('+52 1','+52')}
const parsedNumber=phoneUtil.parseAndKeepRawInput(number)
return phoneUtil.isValidNumber(parsedNumber)}catch(error){return false}}