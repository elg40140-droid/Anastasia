// handler.js - نظام متكامل مع الأنظمة الجديدة
import{smsg}from'./lib/simple.js'
import{format}from'util'
import*as ws from'ws'
import{fileURLToPath}from'url'
import path,{join}from'path'
import{unwatchFile,watchFile}from'fs'
import chalk from'chalk'

// 🌍 أنظمة اللغات والزخرفة المتقدمة
import{translateResponse as tr,translateButtons as tb,smartTranslate,getUserSettings,getChatSettings,getUserLang,detectUserCountry,FONT_STYLES,DECORATION_STYLES}from'./lib/language.js'

const{proto}=(await import('@whiskeysockets/baileys')).default
const isNumber=x=>typeof x==='number'&&!isNaN(x)
const delay=ms=>isNumber(ms)&&new Promise(resolve=>setTimeout(function(){clearTimeout(this);resolve()},ms))

// 🆕 نظام الرسائل المدمج مع الأنظمة الجديدة
const failureHandler=async(type,conn,m,customMessage)=>{
const userCountry=detectUserCountry(m.sender)
const userSettings=getUserSettings(m.sender)
const messages={
rowner:`❌ *【${global.comando2}】*\nهذا الأمر حصري للمالكين الرئيسيين\nليس لديك الصلاحية الكافية`,
owner:`❌ *【${global.comando2}】*\nهذا الأمر للمطورين فقط\nصلاحياتك غير كافية`,
mods:`❌ *【${global.comando2}】*\nمخصص للمشرفين فقط\nملفك الشخصي لا يستوفي المتطلبات`,
premium:`❌ *【${global.comando2}】*\nميزة حصرية للمستخدمين المميزين\nهذا الامتياز غير متاح لك بعد`,
group:`❌ *【${global.comando2}】*\nمتاح في المجموعات فقط\nهذه البيئة غير صالحة`,
private:`❌ *【${global.comando2}】*\nيجب استخدامه في الدردشة الخاصة`,
admin:`❌ *【${global.comando2}】*\nيتطلب صلاحيات المسؤول\nتم رفض الوصول`,
botAdmin:`❌ *【${global.comando2}】*\nيحتاج البوت أن يكون مسؤولاً\nيرجى تحديث الصلاحيات`,
unreg:`🎋 *لم يتم تسجيلك بعد*\n• سجل نفسك لاستخدام هذه الميزة\n\n🍏 */reg الاسم.العمر*\n\n> 🌿 مثال:\n> _#reg أحمد.20_`,
restrict:`🚫 هذه الميزة معطلة حالياً`,
channel:`❌ *【${global.comando2}】*\nهذا الأمر للقنوات فقط!`,
channelOwner:`❌ *【${global.comando2}】*\nهذا الأمر لمالك القناة فقط!`,
groupOwner:`❌ *【${global.comando2}】*\nهذا الأمر لمالك المجموعة فقط!`,
groupCreator:`❌ *【${global.comando2}】*\nهذا الأمر لمنشئ المجموعة فقط!`,
broadcast:`❌ *【${global.comando2}】*\nهذا الأمر للبث فقط!`,
newsletter:`❌ *【${global.comando2}】*\nهذا الأمر للنشرات الإخبارية فقط!`,
arabic:`❌ *【${global.comando2}】*\nهذا الأمر للمستخدمين العرب فقط!`,
english:`❌ *【${global.comando2}】*\nهذا الأمر لمستخدمي الإنجليزية فقط!`,
egypt:`❌ *【${global.comando2}】*\nهذا الأمر للمستخدمين من مصر فقط!`,
saudi:`❌ *【${global.comando2}】*\nهذا الأمر للمستخدمين من السعودية فقط!`,
gcc:`❌ *【${global.comando2}】*\nهذا الأمر لمستخدمين دول الخليج فقط!`,
middleEast:`❌ *【${global.comando2}】*\nهذا الأمر لمستخدمين الشرق الأوسط فقط!`,
language:`❌ *【${global.comando2}】*\nهذا الأمر للغة ${type} فقط!`,
country:`❌ *【${global.comando2}】*\nهذا الأمر لمستخدمين من ${userCountry.name} فقط!`,
botOnly:`❌ *【${global.comando2}】*\nهذا الأمر للبوت فقط!`,
smallGroup:`❌ *【${global.comando2}】*\nيجب أن تحتوي المجموعة على 10 أعضاء على الأقل`,
largeGroup:`❌ *【${global.comando2}】*\nيجب أن تحتوي المجموعة على 100 عضو على الأقل`,
veryLargeGroup:`❌ *【${global.comando2}】*\nيجب أن تحتوي المجموعة على 500 عضو على الأقل`,
newGroup:`❌ *【${global.comando2}】*\nيجب أن تكون المجموعة حديثة الإنشاء (أقل من 7 أيام)`,
oldGroup:`❌ *【${global.comando2}】*\nيجب أن تكون المجموعة قديمة الإنشاء (أكثر من شهر)`,
minGroupSize:`❌ *【${global.comando2}】*\nعدد الأعضاء في المجموعة غير كافٍ`
}
const message=customMessage||messages[type]||`❌ ليس لديك صلاحية استخدام هذا الأمر (${type})`
// 🆕 تطبيق الأنظمة الجديدة على الرسالة
let finalMessage=await smartTranslate(m,message,{
decorate:userSettings.autoDecorate,
fontStyle:userSettings.fontStyle
})
const contextInfo={
mentionedJid:[m.sender],
isForwarded:true,
forwardingScore:999,
externalAdReply:{
title:global.packname,
body:global.author,
thumbnailUrl:global.logo,
sourceUrl:global.gp1,
mediaType:1,
renderLargerThumbnail:true
}
}

conn.reply(m.chat,finalMessage,m,{contextInfo}).then(_=>m.react?.('✖️'))
}

// 🆕 دوال الأنظمة الجديدة
const translate=async(m,text,options={})=>await smartTranslate(m,text,options)
const translateBtn=async(m,buttons)=>await tb(m,buttons)

export async function handler(chatUpdate){
this.msgqueque=this.msgqueque||[]
this.uptime=this.uptime||Date.now()
if(!chatUpdate)return
this.pushMessage(chatUpdate.messages).catch(console.error)
let m=chatUpdate.messages[chatUpdate.messages.length-1]
if(!m)return
if(global.db.data==null)await global.loadDatabase()
try{
m=smsg(this,m)||m
if(!m)return
m.exp=0;m.coin=false
// ✨ تحميل الإعدادات من ملف settings.js
const{loadUserSettings,loadChatSettings,loadBotSettings}=await import('./settings.js')
await loadUserSettings(m.sender,m)
await loadChatSettings(m.chat)
await loadBotSettings(this.user.jid)

let user=global.db.data.users[m.sender]||{}
let chat=global.db.data.chats[m.chat]||{}
let settings=global.db.data.settings[this.user.jid]||{}

// ✨ صلاحيات المستخدم الأساسية
const detectwhat=m.sender.includes('@lid')?'@lid':'@s.whatsapp.net'
const isROwner=[...global.owner.map(([number])=>number)].map(v=>v.replace(/[^0-9]/g,'')+detectwhat).includes(m.sender)
const isOwner=isROwner||m.fromMe
const isMods=isROwner||global.mods.map(v=>v.replace(/[^0-9]/g,'')+detectwhat).includes(m.sender)
const isPrems=isROwner||global.prems.map(v=>v.replace(/[^0-9]/g,'')+detectwhat).includes(m.sender)||user.premium
// 🆕 صلاحيات جديدة متقدمة
const userCountry=detectUserCountry(m.sender)
const userLanguage=getUserLang(m.sender)
const userSettings=getUserSettings(m.sender)
const chatSettings=getChatSettings(m.chat)
const isArabic=userLanguage==='ar'
const isEnglish=userLanguage==='en'
const isFromEgypt=userCountry.code==='eg'
const isFromSaudi=userCountry.code==='sa'
const isFromGCC=['sa','ae','qa','kw','bh','om'].includes(userCountry.code)
const isFromMiddleEast=['eg','sa','ae','qa','kw','bh','om','jo','sy','lb','iq','ye','ma','dz','tn','ly','mr','sd'].includes(userCountry.code)
let usedPrefix
async function getLidFromJid(id,conn){if(id.endsWith('@lid'))return id;const res=await conn.onWhatsApp(id).catch(()=>[]);return res[0]?.lid||id}

const senderLid=await getLidFromJid(m.sender,this)
const botLid=await getLidFromJid(this.user.jid,this)
const senderJid=m.sender,botJid=this.user.jid
const groupMetadata=m.isGroup?((this.chats[m.chat]||{}).metadata||await this.groupMetadata(m.chat).catch(_=>null)):{}
const participants=m.isGroup?(groupMetadata.participants||[]):[]
const userParticipant=participants.find(p=>p.id===senderLid||p.jid===senderJid)||{}
const botParticipant=participants.find(p=>p.id===botLid||p.id===botJid)||{}
const isRAdmin=userParticipant?.admin==="superadmin"
const isAdmin=isRAdmin||userParticipant?.admin==="admin"
const isBotAdmin=!!botParticipant?.admin
const isGroup=m.isGroup
const isGroupOwner=isGroup&&groupMetadata?.owner===m.sender
const isGroupCreator=isGroup&&groupMetadata?.restrict===false
const isBroadcast=m.chat.endsWith('@broadcast')
const isNewsletter=m.chat.endsWith('@newsletter')
const isChannel=isNewsletter||isBroadcast
const isChannelOwner=isChannel&&m.key.fromMe
const isPrivate=!isGroup&&!isChannel
const groupSize=participants.length
const isSmallGroup=groupSize<10
const isLargeGroup=groupSize>100
const isVeryLargeGroup=groupSize>500
const groupCreation=groupMetadata.creation||0
const isNewGroup=Date.now()-groupCreation<604800000
const isOldGroup=Date.now()-groupCreation>2592000000
const ___dirname=path.join(path.dirname(fileURLToPath(import.meta.url)),'./plugins/_')
const bot=this.user||{}
if(m.isBaileys)return
if(opts['nyimak'])return
if(!isROwner&&opts['self'])return
if(opts['swonly']&&m.chat!=='status@broadcast')return
if(typeof m.text!=='string')m.text=''

// ✨ نظام الانتظار (Queue)
if(opts['queque']&&m.text&&!(isMods||isPrems)){
let queque=this.msgqueque,time=1000*5
const previousID=queque[queque.length-1]
queque.push(m.id||m.key.id)
setInterval(async function(){if(queque.indexOf(previousID)===-1)clearInterval(this);await delay(time)},time)
}

m.exp+=Math.ceil(Math.random()*10)

for(let name in global.plugins){
let plugin=global.plugins[name];if(!plugin)continue;if(plugin.disabled)continue
const __filename=join(___dirname,name)
if(typeof plugin.all==='function'){try{await plugin.all.call(this,m,{chatUpdate,__dirname:___dirname,__filename})}catch(e){console.error(e)}}
if(!opts['restrict']&&plugin.tags&&plugin.tags.includes('admin'))continue
const str2Regex=str=>str.replace(/[|\\{}()[\]^$+*?.]/g,'\\$&')
let _prefix=plugin.customPrefix?plugin.customPrefix:this.prefix?this.prefix:global.prefix
let match=(_prefix instanceof RegExp?[[_prefix.exec(m.text),_prefix]]:Array.isArray(_prefix)?_prefix.map(p=>{let re=p instanceof RegExp?p:new RegExp(str2Regex(p));return[re.exec(m.text),re]}):typeof _prefix==='string'?[[new RegExp(str2Regex(_prefix)).exec(m.text),new RegExp(str2Regex(_prefix))]]:[[[],new RegExp]]).find(p=>p[1])
if(typeof plugin.before==='function'){if(await plugin.before.call(this,m,{match,conn:this,participants,groupMetadata,user,bot,isROwner,isOwner,isRAdmin,isAdmin,isBotAdmin,isPrems,isGroup,isGroupOwner,isGroupCreator,isChannel,isChannelOwner,isPrivate,isArabic,isEnglish,isFromEgypt,isFromSaudi,isFromGCC,isFromMiddleEast,userCountry,userLanguage,chatUpdate,__dirname:___dirname,__filename}))continue}
if(typeof plugin!=='function')continue
if((usedPrefix=(match[0]||'')[0])){
let noPrefix=m.text.replace(usedPrefix,'')
let[command,...args]=noPrefix.trim().split` `.filter(v=>v);args=args||[]
let _args=noPrefix.trim().split` `.slice(1)
let text=_args.join` `;command=(command||'').toLowerCase()
let fail=failureHandler
let isAccept=plugin.command instanceof RegExp?plugin.command.test(command):Array.isArray(plugin.command)?plugin.command.some(cmd=>cmd instanceof RegExp?cmd.test(command):cmd===command):typeof plugin.command==='string'?plugin.command===command:false
global.comando2=command
if((m.id.startsWith('NJX-')||(m.id.startsWith('BAE5')&&m.id.length===16)||(m.id.startsWith('B24E')&&m.id.length===20)))return
if(!isAccept)continue
m.plugin=name

// ✨ التحقق من إعدادات المحادثة والمستخدم
let chat=global.db.data.chats[m.chat];let user=global.db.data.users[m.sender]
if(!['grupo-unbanchat.js'].includes(name)&&chat&&chat.isBanned&&!isROwner)return
if(name!='grupo-unbanchat.js'&&name!='owner-exec.js'&&name!='owner-exec2.js'&&name!='grupo-delete.js'&&chat?.isBanned&&!isROwner)return
if(m.text&&user.banned&&!isROwner){
let bannedText=`❌ تم حظرك من البوت\nالسبب: ${user.bannedReason||'غير محدد'}\nللتواصل مع المالك:\n${global.owner[0][0]}`
m.reply(await translate(m,bannedText));return
}
let adminMode=chat.modoadmin
let mini=`${plugin.botAdmin||plugin.admin||plugin.group||plugin||!usedPrefix||m.text.slice(0,1)==usedPrefix||plugin.command}`
if(adminMode&&!isOwner&&!isROwner&&m.isGroup&&!isAdmin&&mini)return

// التحقق من الصلاحيات الخاصة بالبلجن
if(plugin.rowner&&!isROwner){fail('rowner',this,m);continue}
if(plugin.owner&&!isOwner){fail('owner',this,m);continue}
if(plugin.mods&&!isMods){fail('mods',this,m);continue}
if(plugin.premium&&!isPrems){fail('premium',this,m);continue}
if(plugin.group&&!m.isGroup){fail('group',this,m);continue}
if(plugin.botAdmin&&!isBotAdmin){fail('botAdmin',this,m);continue}
if(plugin.admin&&!isAdmin){fail('admin',this,m);continue}
if(plugin.private&&m.isGroup){fail('private',this,m);continue}
if(plugin.register===true&&user.registered==false){fail('unreg',this,m);continue}
// المجموعة المتقدمة
if(plugin.smallGroup&&!isSmallGroup){fail('smallGroup',this,m);continue}
if(plugin.largeGroup&&!isLargeGroup){fail('largeGroup',this,m);continue}
if(plugin.veryLargeGroup&&!isVeryLargeGroup){fail('veryLargeGroup',this,m);continue}
if(plugin.newGroup&&!isNewGroup){fail('newGroup',this,m);continue}
if(plugin.oldGroup&&!isOldGroup){fail('oldGroup',this,m);continue}
if(plugin.minGroupSize&&groupSize<plugin.minGroupSize){fail('minGroupSize',this,m);continue}

if(plugin.channel&&!isChannel){fail('channel',this,m);continue}
if(plugin.channelOwner&&!isChannelOwner){fail('channelOwner',this,m);continue}
if(plugin.groupOwner&&!isGroupOwner){fail('groupOwner',this,m);continue}
if(plugin.groupCreator&&!isGroupCreator){fail('groupCreator',this,m);continue}
if(plugin.broadcast&&!isBroadcast){fail('broadcast',this,m);continue}
if(plugin.newsletter&&!isNewsletter){fail('newsletter',this,m);continue}
if(plugin.arabic&&!isArabic){fail('arabic',this,m);continue}
if(plugin.english&&!isEnglish){fail('english',this,m);continue}
if(plugin.egypt&&!isFromEgypt){fail('egypt',this,m);continue}
if(plugin.saudi&&!isFromSaudi){fail('saudi',this,m);continue}
if(plugin.gcc&&!isFromGCC){fail('gcc',this,m);continue}
if(plugin.middleEast&&!isFromMiddleEast){fail('middleEast',this,m);continue}
if(plugin.language&&plugin.language!==userLanguage){fail('language',this,m);continue}
if(plugin.country&&plugin.country!==userCountry.code){fail('country',this,m);continue}
if(plugin.botOnly&&!m.fromMe){fail('botOnly',this,m);continue}

m.isCommand=true
let xp='exp' in plugin?parseInt(plugin.exp):10
m.exp+=xp
if(!isPrems&&plugin.coin&&user.coin<plugin.coin*1){
let coinText=`❌ نفدت نقاطك\nلا يمكنك استخدام هذا الأمر\nاحصل على نقاط من الأوامر اليومية`
m.reply(await translate(m,coinText));continue
}
if(plugin.level>user.level){
let levelText=`❌ مستوى غير كافٍ\nالمستوى المطلوب: ${plugin.level}\nمستواك الحالي: ${user.level}\nاستخدم: ${usedPrefix}ترقية`
m.reply(await translate(m,levelText));continue
}

// 🎯 كائن extra يحتوي على جميع البيانات والدوال المساعدة
let extra={
match,usedPrefix,noPrefix,_args,args,command,text,
conn:this,participants,groupMetadata,user,bot,
isROwner,isOwner,isRAdmin,isAdmin,isBotAdmin,isPrems,
groupSize,isSmallGroup,isLargeGroup,isVeryLargeGroup,isNewGroup,isOldGroup,
isGroup,isGroupOwner,isGroupCreator,isChannel,isChannelOwner,isPrivate,
isArabic,isEnglish,isFromEgypt,isFromSaudi,isFromGCC,isFromMiddleEast,
userCountry,userLanguage,userSettings,chatSettings,
chatUpdate,__dirname:___dirname,__filename,
translate,translateBtn,tr:translate,tb:translateBtn,
smartTranslate// 🆕 الترجمة الذكية
}
try{
await plugin.call(this,m,extra)
if(!isPrems)m.coin=m.coin||plugin.coin||false
}catch(e){
m.error=e;console.error(e)
if(e){
let text=format(e)
for(let key of Object.values(global.APIKeys))text=text.replace(new RegExp(key,'g'),'🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑')
m.reply(await translate(m,text))
}
}finally{
if(typeof plugin.after==='function'){try{await plugin.after.call(this,m,extra)}catch(e){console.error(e)}}
if(m.coin){
let coinUsedText=`💎 استخدمت نقاط\nالمبلغ: ${+m.coin} نقطة\nتم خصمها من رصيدك`
m.reply(await translate(m,coinUsedText))
}
}
break
}
}
}catch(e){console.error(e)}finally{
if(opts['queque']&&m.text){
const quequeIndex=this.msgqueque.indexOf(m.id||m.key.id)
if(quequeIndex!=-1)this.msgqueque.splice(quequeIndex,1)
}
let user,stats=global.db.data.stats
if(m){
let utente=global.db.data.users[m.sender]
if(utente.muto==true){
let bang=m.key.id,cancellazzione=m.key.participant
await this.sendMessage(m.chat,{delete:{remoteJid:m.chat,fromMe:false,id:bang,participant:cancellazzione}})
}
if(m.sender&&(user=global.db.data.users[m.sender])){user.exp+=m.exp;user.coin-=m.coin*1}
let stat
if(m.plugin){
let now=+new Date
if(m.plugin in stats){stat=stats[m.plugin];if(!isNumber(stat.total))stat.total=1;if(!isNumber(stat.success))stat.success=m.error!=null?0:1;if(!isNumber(stat.last))stat.last=now;if(!isNumber(stat.lastSuccess))stat.lastSuccess=m.error!=null?0:now}else{stat=stats[m.plugin]={total:1,success:m.error!=null?0:1,last:now,lastSuccess:m.error!=null?0:now}}
stat.total+=1;stat.last=now
if(m.error==null){stat.success+=1;stat.lastSuccess=now}
}
}

try{if(!opts['noprint'])await(await import('./lib/print.js')).default(m,this)}catch(e){console.log(m,m.quoted,e)}
let settingsREAD=global.db.data.settings[this.user.jid]||{}
if(opts['autoread'])await this.readMessages([m.key])

// ✨ تفاعل رموز عشوائية مع دعم اللغات
if(global.db.data.chats[m.chat].reaction&&m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|rin|a|s)/gi)){
let emot=pickRandom(["🍟","😃","😄","😁","😆","🍓"])
if(!m.fromMe)await this.sendMessage(m.chat,{react:{text:emot,key:m.key}})
}
}
}
function pickRandom(list){return list[Math.floor(Math.random()*list.length)]}

// 🎯 تعيين دالة dfail العالمية
global.dfail=failureHandler

const file=global.__filename(import.meta.url,true)
watchFile(file,async()=>{unwatchFile(file);console.log(chalk.green('تم تحديث "handler.js"'));if(global.conns&&global.conns.length>0){const users=[...new Set([...global.conns.filter((conn)=>conn.user&&conn.ws.socket&&conn.ws.socket.readyState!==ws.CLOSED).map((conn)=>conn)])];for(const userr of users){userr.subreloadHandler(false)}}})