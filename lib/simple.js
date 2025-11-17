const{imageToWebp,videoToWebp,writeExifImg,writeExifVid}=(await import('./exif.js')).default
import{writeExif}from'./myfunc.js'
let conv=await import('./sticker.js')
import path from'path'
import{toAudio}from'./converter.js'
import chalk from'chalk'
import fetch from'node-fetch'
import PhoneNumber from'awesome-phonenumber'
import fs from'fs'
import util,{format}from'util'
import{fileTypeFromBuffer}from'file-type'
import{fileURLToPath}from'url'
import store from'./store.js'
import Jimp from'jimp'
import pino from'pino'
import*as baileys from"@whiskeysockets/baileys"
import axios from'axios'
const __dirname=path.dirname(fileURLToPath(import.meta.url))
const{default:_makeWaSocket,makeWALegacySocket,proto,downloadContentFromMessage,jidDecode,areJidsSameUser,generateWAMessage,generateForwardMessageContent,generateWAMessageFromContent,WAMessageStubType,extractMessageContent,makeInMemoryStore,getAggregateVotesInPollMessage,prepareWAMessageMedia,MessageType,Mimetype,jidNormalizedUser,WA_DEFAULT_EPHEMERAL}=(await import('@whiskeysockets/baileys')).default

function nullish(args){return!(args!==null&&args!==undefined)}
function isNumber(){const int=parseInt(this);return typeof int==='number'&&!isNaN(int)}
function getRandom(){if(Array.isArray(this)||this instanceof String)return this[Math.floor(Math.random()*this.length)];return Math.floor(Math.random()*this)}

export function makeWASocket(connectionOptions,options={}){
let conn=(global.opts&&global.opts['legacy']?makeWALegacySocket:_makeWaSocket)(connectionOptions)
let sock=Object.defineProperties(conn,{
chats:{value:{...(options.chats||{})},writable:true},
decodeJid:{value(jid){if(!jid||typeof jid!=='string')return(!nullish(jid)&&jid)|| null;return jid.decodeJid()}},
logger:{get(){return{
info(...args){console.log(chalk.bold.bgRgb(51,204,51)('INFO '),`[${chalk.rgb(255,255,255)(new Date().toUTCString())}]:`,chalk.cyan(format(...args)))},
error(...args){console.log(chalk.bold.bgRgb(247,38,33)('ERROR '),`[${chalk.rgb(255,255,255)(new Date().toUTCString())}]:`,chalk.rgb(255,38,0)(format(...args)))},
warn(...args){console.log(chalk.bold.bgRgb(255,153,0)('WARNING '),`[${chalk.rgb(255,255,255)(new Date().toUTCString())}]:`,chalk.redBright(format(...args)))},
trace(...args){console.log(chalk.grey('TRACE '),`[${chalk.rgb(255,255,255)(new Date().toUTCString())}]:`,chalk.white(format(...args)))},
debug(...args){console.log(chalk.bold.bgRgb(66,167,245)('DEBUG '),`[${chalk.rgb(255,255,255)(new Date().toUTCString())}]:`,chalk.white(format(...args)))}
}},enumerable:true},
sendSylph:{async value(jid,text='',buffer,title,body,url,quoted,options){
if(buffer)try{let type=await conn.getFile(buffer);buffer=type.data}catch{buffer=buffer}
let prep=generateWAMessageFromContent(jid,{extendedTextMessage:{text:text,contextInfo:{externalAdReply:{title:title,body:body,thumbnail:buffer,sourceUrl:url},mentionedJid:await conn.parseMention(text)}}},{quoted:quoted})
return conn.relayMessage(jid,prep.message,{messageId:prep.key.id})}},
sendSylphy:{async value(jid,medias,options={}){
if(typeof jid!=="string"){throw new TypeError(`jid must be string, received: ${jid} (${jid?.constructor?.name})`)}
for(const media of medias){
if(!media.type||(media.type!=="image"&&media.type!=="video")){throw new TypeError(`media.type must be "image" or "video", received: ${media.type} (${media.type?.constructor?.name})`)}
if(!media.data||(!media.data.url&&!Buffer.isBuffer(media.data))){throw new TypeError(`media.data must be object with url or buffer, received: ${media.data} (${media.data?.constructor?.name})`)}}
if(medias.length<2){throw new RangeError("Minimum 2 media")}
const delay=!isNaN(options.delay)?options.delay:500;
delete options.delay;
const album=baileys.generateWAMessageFromContent(jid,{messageContextInfo:{},albumMessage:{expectedImageCount:medias.filter(media=>media.type==="image").length,expectedVideoCount:medias.filter(media=>media.type==="video").length,...(options.quoted?{contextInfo:{remoteJid:options.quoted.key.remoteJid,fromMe:options.quoted.key.fromMe,stanzaId:options.quoted.key.id,participant:options.quoted.key.participant||options.quoted.key.remoteJid,quotedMessage:options.quoted.message,},}:{}),}},{});
await conn.relayMessage(album.key.remoteJid,album.message,{messageId:album.key.id});
for(let i=0;i<medias.length;i++){
const{type,data,caption}=medias[i];
const message=await baileys.generateWAMessage(album.key.remoteJid,{[type]:data,caption:caption||""},{upload:conn.waUploadToServer});
message.message.messageContextInfo={messageAssociation:{associationType:1,parentMessageKey:album.key},};
await conn.relayMessage(message.key.remoteJid,message.message,{messageId:message.key.id});
await baileys.delay(delay);}
return album;}},
getFile:{async value(PATH,saveToFile=false){
let res,filename
const data=Buffer.isBuffer(PATH)?PATH:PATH instanceof ArrayBuffer?PATH.toBuffer():/^data:.*?\/.*?;base64,/i.test(PATH)?Buffer.from(PATH.split`,`[1],'base64'):/^https?:\/\//.test(PATH)?await(res=await fetch(PATH)).buffer():fs.existsSync(PATH)?(filename=PATH,fs.readFileSync(PATH)):typeof PATH==='string'?PATH:Buffer.alloc(0)
if(!Buffer.isBuffer(data))throw new TypeError('Result is not a buffer')
const type=await fileTypeFromBuffer(data)||{mime:'application/octet-stream',ext:'.bin'}
if(data&&saveToFile&&!filename)(filename=path.join(__dirname,'../tmp/'+new Date*1+'.'+type.ext),await fs.promises.writeFile(filename,data))
return{res,filename,...type,data,deleteFile(){return filename&&fs.promises.unlink(filename)}}},enumerable:true},
sendFile:{async value(jid,path,filename='',caption='',quoted,ptt=false,options={}){
let type=await conn.getFile(path,true)
let{res,data:file,filename:pathFile}=type
if(res&&res.status!==200||file.length<=65536){
try{throw{json:JSON.parse(file.toString())}}
catch(e){if(e.json)throw e.json}}
let opt={}
if(quoted)opt.quoted=quoted
if(!type)options.asDocument=true
let mtype='',mimetype=options.mimetype||type.mime,convert
if(/webp/.test(type.mime)||(/image/.test(type.mime)&&options.asSticker))mtype='sticker'
else if(/image/.test(type.mime)||(/webp/.test(type.mime)&&options.asImage))mtype='image'
else if(/video/.test(type.mime))mtype='video'
else if(/audio/.test(type.mime))(convert=await toAudio(file,type.ext),file=convert.data,pathFile=convert.filename,mtype='audio',mimetype=options.mimetype||'audio/ogg; codecs=opus')
else mtype='document'
if(options.asDocument)mtype='document'
delete options.asSticker
delete options.asLocation
delete options.asVideo
delete options.asDocument
delete options.asImage
let message={...options,caption,ptt,[mtype]:{url:pathFile},mimetype,fileName:filename||pathFile.split('/').pop()}
let m
try{m=await conn.sendMessage(jid,message,{...opt,...options})}catch(e){
console.error(e)
m=null
}finally{
if(!m)m=await conn.sendMessage(jid,{...message,[mtype]:file},{...opt,...options})
file=null
return m}},enumerable:true},
waitEvent:{value(eventName,is=()=>true,maxTries=25){
return new Promise((resolve,reject)=>{
let tries=0
let on=(...args)=>{
if(++tries>maxTries)reject('Max tries reached')
else if(is()){
conn.ev.off(eventName,on)
resolve(...args)}}
conn.ev.on(eventName,on)})}},
msToDate:{async value(ms){
let days=Math.floor(ms/(24*60*60*1000));
let hours=Math.floor((ms%(24*60*60*1000))/(60*60*1000));
let minutes=Math.floor((ms%(60*60*1000))/(60*1000));
let seconds=Math.floor((ms%(60*1000))/(1000));
return(days?`${days} days `:'')+(hours?`${hours} Hour `:'')+(minutes?`${minutes} Menutes `:'')+(seconds?`${seconds} Seconds`:'')}},
sendPoll:{async value(jid,name='',values=[],selectableCount=1){return conn.sendMessage(jid,{poll:{name,values,selectableCount}})}},
sendButtonGif:{async value(jid,text='',footer='',gif,but=[],buff,options={}){
let file=await conn.resize(buff,300,150)
let a=[1,2]
let b=a[Math.floor(Math.random()*a.length)]
conn.sendMessage(jid,{video:gif,gifPlayback:true,gifAttribution:b,caption:text,footer:footer,jpegThumbnail:file,templateButtons:but,...options})}},
sendStimg:{async value(jid,path,quoted,options={}){
let buff=Buffer.isBuffer(path)?path:/^data:.*?\/.*?;base64,/i.test(path)?Buffer.from(path.split`,`[1],'base64'):/^https?:\/\//.test(path)?await(await fetch(path)).buffer():fs.existsSync(path)?fs.readFileSync(path):Buffer.alloc(0)
let buffer
if(options&&(options.packname||options.author)){buffer=await writeExifImg(buff,options)}else{buffer=await imageToWebp(buff)}
await conn.sendMessage(jid,{sticker:{url:buffer},...options},{quoted})
return buffer}},
sendStvid:{async value(jid,path,quoted,options={}){
let buff=Buffer.isBuffer(path)?path:/^data:.*?\/.*?;base64,/i.test(path)?Buffer.from(path.split`,`[1],'base64'):/^https?:\/\//.test(path)?await getBuffer(path):fs.existsSync(path)?fs.readFileSync(path):Buffer.alloc(0)
let buffer
if(options&&(options.packname||options.author)){buffer=await writeExifVid(buff,options)}else{buffer=await videoToWebp(buff)}
await conn.sendMessage(jid,{sticker:{url:buffer},...options},{quoted})
return buffer}},
saveMedia:{async value(message,filename,attachExtension=true){
let quoted=message.msg?message.msg:message
let mime=(message.msg||message).mimetype||''
let messageType=message.mtype?message.mtype.replace(/Message/gi,''):mime.split('/')[0]
const stream=await downloadContentFromMessage(quoted,messageType)
let buffer=Buffer.from([])
for await(const chunk of stream){buffer=Buffer.concat([buffer,chunk])}
let type=await fileTypeFromBuffer(buffer)
let trueFileName=attachExtension?(filename+'.'+type.ext):filename
await fs.writeFileSync(trueFileName,buffer)
return trueFileName}},
sendImage:{value(jid,path,caption='',quoted='',options){
let buffer=Buffer.isBuffer(path)?path:/^data:.*?\/.*?;base64,/i.test(path)?Buffer.from(path.split`,`[1],'base64'):/^https?:\/\//.test(path)?global.fetchBuffer(path):fs.existsSync(path)?fs.readFileSync(path):Buffer.alloc(0)
conn.sendMessage(jid,{image:buffer,caption:caption,...options},{quoted})}},
sendVideo:{value(jid,path,caption='',quoted='',gif=false,options){
let buffer=Buffer.isBuffer(path)?path:/^data:.*?\/.*?;base64,/i.test(path)?Buffer.from(path.split`,`[1],'base64'):/^https?:\/\//.test(path)?global.fetchBuffer(path):fs.existsSync(path)?fs.readFileSync(path):Buffer.alloc(0)
conn.sendMessage(jid,{video:buffer,caption:caption,gifPlayback:gif,...options},{quoted})}},
footerImg:{async value(jid,footer,text,media,quoted,options){
let msg=await generateWAMessageFromContent(jid,{interactiveMessage:{body:{text:null},footer:{text:footer},header:{title:text,hasMediaAttachment:false,...await prepareWAMessageMedia({image:{url:media}},{upload:conn.waUploadToServer})},nativeFlowMessage:{buttons:[{title:''}]}}},{quoted,...options})
await conn.relayMessage(jid,msg.message,{})}},
footerTxt:{async value(jid,text,footer,quoted,options){
let msg=await generateWAMessageFromContent(jid,{interactiveMessage:{body:{text:text},footer:{text:footer},nativeFlowMessage:{buttons:[{title:''}]}}},{quoted,...options})
await conn.relayMessage(jid,msg.message,{})}},
sendGroupV4Invite:{async value(jid,participant,inviteCode,inviteExpiration,groupName='unknown subject',caption='Invitation to join my WhatsApp group',jpegThumbnail,options={}){
const msg=proto.Message.fromObject({groupInviteMessage:proto.GroupInviteMessage.fromObject({inviteCode,inviteExpiration:parseInt(inviteExpiration)||+new Date(new Date+(3*86400000)),groupJid:jid,groupName:(groupName?groupName:await conn.getName(jid))||null,jpegThumbnail:Buffer.isBuffer(jpegThumbnail)?jpegThumbnail:null,caption})})
const message=generateWAMessageFromContent(participant,msg,options)
await conn.relayMessage(participant,message.message,{messageId:message.key.id,additionalAttributes:{...options}})
return message},enumerable:true},
cMod:{value(jid,message,text='',sender=conn.user.jid,options={}){
if(options.mentions&&!Array.isArray(options.mentions))options.mentions=[options.mentions]
let copy=message.toJSON()
delete copy.message.messageContextInfo
delete copy.message.senderKeyDistributionMessage
let mtype=Object.keys(copy.message)[0]
let msg=copy.message
let content=msg[mtype]
if(typeof content==='string')msg[mtype]=text||content
else if(content.caption)content.caption=text||content.caption
else if(content.text)content.text=text||content.text
if(typeof content!=='string'){
msg[mtype]={...content,...options}
msg[mtype].contextInfo={...(content.contextInfo||{}),mentionedJid:options.mentions||content.contextInfo?.mentionedJid||[]}
}
if(copy.participant)sender=copy.participant=sender||copy.participant
else if(copy.key.participant)sender=copy.key.participant=sender||copy.key.participant
if(copy.key.remoteJid.includes('@s.whatsapp.net'))sender=sender||copy.key.remoteJid
else if(copy.key.remoteJid.includes('@broadcast'))sender=sender||copy.key.remoteJid
copy.key.remoteJid=jid
copy.key.fromMe=areJidsSameUser(sender,conn.user.id)||false
return proto.WebMessageInfo.fromObject(copy)
},enumerable:true},
copyNForward:{async value(jid,message,forwardingScore=true,options={}){
let vtype
if(options.readViewOnce&&message.message.viewOnceMessage?.message){
vtype=Object.keys(message.message.viewOnceMessage.message)[0]
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message=proto.Message.fromObject(JSON.parse(JSON.stringify(message.message.viewOnceMessage.message)))
message.message[vtype].contextInfo=message.message.viewOnceMessage.contextInfo
}
let mtype=Object.keys(message.message)[0]
let m=generateForwardMessageContent(message,!!forwardingScore)
let ctype=Object.keys(m)[0]
if(forwardingScore&&typeof forwardingScore==='number'&&forwardingScore>1)m[ctype].contextInfo.forwardingScore+=forwardingScore
m[ctype].contextInfo={...(message.message[mtype].contextInfo||{}),...(m[ctype].contextInfo||{})}
m=generateWAMessageFromContent(jid,m,{...options,userJid:conn.user.jid})
await conn.relayMessage(jid,m.message,{messageId:m.key.id,additionalAttributes:{...options}})
return m
},enumerable:true},
fakeReply:{value(jid,text='',fakeJid=this.user.jid,fakeText='',fakeGroupJid,options){return conn.reply(jid,text,{key:{fromMe:areJidsSameUser(fakeJid,conn.user.id),participant:fakeJid,...(fakeGroupJid?{remoteJid:fakeGroupJid}:{})},message:{conversation:fakeText},...options})}},
setBio:{async value(status){return await conn.query({tag:'iq',attrs:{to:'s.whatsapp.net',type:'set',xmlns:'status',},content:[{tag:'status',attrs:{},content:Buffer.from(status,'utf-8')}]})}},
sendStickerFromUrl:{async value(from,PATH,quoted,options={}){
let types=await conn.getFile(PATH,true)
let{filename,size,ext,mime,data}=types
let type='',mimetype=mime,pathFile=filename
let media={mimetype:mime,data}
let pathFile1=await writeExif(media,{packname:options.packname?options.packname:'SILANA AI',author:options.author?options.author:'',categories:options.categories?options.categories:[]})
await fs.promises.unlink(filename)
await conn.sendMessage(from,{sticker:{url:pathFile1}},{quoted:quoted})
return fs.promises.unlink(pathFile1)}},
downloadM:{async value(m,type,saveToFile){
let filename
if(!m||!(m.url||m.directPath))return Buffer.alloc(0)
const stream=await downloadContentFromMessage(m,type)
let buffer=Buffer.from([])
for await(const chunk of stream){
buffer=Buffer.concat([buffer,chunk])
}
if(saveToFile)({filename}=await conn.getFile(buffer,true))
return saveToFile&&fs.existsSync(filename)?filename:buffer
},enumerable:true},
parseMention:{value(text=''){return[...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v=>v[1]+'@s.whatsapp.net')},enumerable:true},
getName:{value(jid='',withoutContact=false){
jid=conn.decodeJid(jid);withoutContact=conn.withoutContact||withoutContact;let v;if(jid.endsWith('@g.us'))return new Promise(async(resolve)=>{v=conn.chats[jid]||{};if(!(v.name||v.subject))v=await conn.groupMetadata(jid)||{};resolve(v.name||v.subject||PhoneNumber('+'+jid.replace('@s.whatsapp.net','')).getNumber('international'))});else v=jid==='0@s.whatsapp.net'?{jid,vname:'WhatsApp'}:areJidsSameUser(jid,conn.user.id)?conn.user:(conn.chats[jid]||{});let userName=global.db?.data?.users[jid.replace('@s.whatsapp.net','')]?.name;if(!userName){userName=PhoneNumber('+'+jid.replace('@s.whatsapp.net','')).getNumber('international')};return(withoutContact?'':v.name)||v.subject||v.vname||v.notify||v.verifiedName||userName},enumerable:true},
loadMessage:{value(messageID){return Object.entries(conn.chats).filter(([_,{messages}])=>typeof messages==='object').find(([_,{messages}])=>Object.entries(messages).find(([k,v])=>(k===messageID||v.key?.id===messageID)))?.[1].messages?.[messageID]},enumerable:true},
processMessageStubType:{async value(m){
if(!m.messageStubType)return
const chat=conn.decodeJid(m.key.remoteJid||m.message?.senderKeyDistributionMessage?.groupId||'')
if(!chat||chat==='status@broadcast')return
const emitGroupUpdate=(update)=>{conn.ev.emit('groups.update',[{id:chat,...update}])}
switch(m.messageStubType){
case WAMessageStubType.REVOKE:
case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
emitGroupUpdate({revoke:m.messageStubParameters[0]})
break
case WAMessageStubType.GROUP_CHANGE_ICON:
emitGroupUpdate({icon:m.messageStubParameters[0]})
break
default:{break}}
const isGroup=chat.endsWith('@g.us')
if(!isGroup)return
let chats=conn.chats[chat]
if(!chats)chats=conn.chats[chat]={id:chat}
chats.isChats=true
const metadata=await conn.groupMetadata(chat).catch(_=>null)
if(!metadata)return
chats.subject=metadata.subject
chats.metadata=metadata
}},
relayWAMessage:{async value(pesanfull){
if(pesanfull.message.audioMessage){await conn.sendPresenceUpdate('recording',pesanfull.key.remoteJid)}else{await conn.sendPresenceUpdate('composing',pesanfull.key.remoteJid)}
var mekirim=await conn.relayMessage(pesanfull.key.remoteJid,pesanfull.message,{messageId:pesanfull.key.id})
conn.ev.emit('messages.upsert',{messages:[pesanfull],type:'append'});
return mekirim}},
insertAllGroup:{async value(){
const groups=await conn.groupFetchAllParticipating().catch(_=>null)||{}
for(const group in groups)conn.chats[group]={...(conn.chats[group]||{}),id:group,subject:groups[group].subject,isChats:true,metadata:groups[group]}
return conn.chats},},
pushMessage:{async value(m){
if(!m)return
if(!Array.isArray(m))m=[m]
for(const message of m){
try{
if(!message)continue
if(message.messageStubType&&message.messageStubType!=WAMessageStubType.CIPHERTEXT)conn.processMessageStubType(message).catch(console.error)
const _mtype=Object.keys(message.message||{})
const mtype=(!['senderKeyDistributionMessage','messageContextInfo'].includes(_mtype[0])&&_mtype[0])||
(_mtype.length>=3&&_mtype[1]!=='messageContextInfo'&&_mtype[1])||
_mtype[_mtype.length-1]
const chat=conn.decodeJid(message.key.remoteJid||message.message?.senderKeyDistributionMessage?.groupId||'')
if(message.message?.[mtype]?.contextInfo?.quotedMessage){
let context=message.message[mtype].contextInfo
let participant=conn.decodeJid(context.participant)
const remoteJid=conn.decodeJid(context.remoteJid||participant)
let quoted=message.message[mtype].contextInfo.quotedMessage
if((remoteJid&&remoteJid!=='status@broadcast')&&quoted){
let qMtype=Object.keys(quoted)[0]
if(qMtype=='conversation'){
quoted.extendedTextMessage={text:quoted[qMtype]}
delete quoted.conversation
qMtype='extendedTextMessage'
}
if(!quoted[qMtype].contextInfo)quoted[qMtype].contextInfo={}
quoted[qMtype].contextInfo.mentionedJid=context.mentionedJid||quoted[qMtype].contextInfo.mentionedJid||[]
const isGroup=remoteJid.endsWith('g.us')
if(isGroup&&!participant)participant=remoteJid
const qM={key:{remoteJid,fromMe:areJidsSameUser(conn.user.jid,remoteJid),id:context.stanzaId,participant,},message:JSON.parse(JSON.stringify(quoted)),...(isGroup?{participant}:{})}
let qChats=conn.chats[participant]
if(!qChats)qChats=conn.chats[participant]={id:participant,isChats:!isGroup}
if(!qChats.messages)qChats.messages={}
if(!qChats.messages[context.stanzaId]&&!qM.key.fromMe)qChats.messages[context.stanzaId]=qM
let qChatsMessages
if((qChatsMessages=Object.entries(qChats.messages)).length>40)qChats.messages=Object.fromEntries(qChatsMessages.slice(30,qChatsMessages.length))
}}
if(!chat||chat==='status@broadcast')continue
const isGroup=chat.endsWith('@g.us')
let chats=conn.chats[chat]
if(!chats){
if(isGroup)await conn.insertAllGroup().catch(console.error)
chats=conn.chats[chat]={id:chat,isChats:true,...(conn.chats[chat]||{})}
}
let metadata,sender
if(isGroup){
if(!chats.subject||!chats.metadata){
metadata=await conn.groupMetadata(chat).catch(_=>({}))||{}
if(!chats.subject)chats.subject=metadata.subject||''
if(!chats.metadata)chats.metadata=metadata
}
sender=conn.decodeJid(message.key?.fromMe&&conn.user.id||message.participant||message.key?.participant||chat||'')
if(sender!==chat){
let chats=conn.chats[sender]
if(!chats)chats=conn.chats[sender]={id:sender}
if(!chats.name)chats.name=message.pushName||chats.name||''
}
}else if(!chats.name)chats.name=message.pushName||chats.name||''
if(['senderKeyDistributionMessage','messageContextInfo'].includes(mtype))continue
chats.isChats=true
if(!chats.messages)chats.messages={}
const fromMe=message.key.fromMe||areJidsSameUser(sender||chat,conn.user.id)
if(!['protocolMessage'].includes(mtype)&&!fromMe&&message.messageStubType!=WAMessageStubType.CIPHERTEXT&&message.message){
delete message.message.messageContextInfo
delete message.message.senderKeyDistributionMessage
chats.messages[message.key.id]=JSON.parse(JSON.stringify(message,null,2))
let chatsMessages
if((chatsMessages=Object.entries(chats.messages)).length>40)chats.messages=Object.fromEntries(chatsMessages.slice(30,chatsMessages.length))
}}catch(e){console.error(e)}}}},
serializeM:{value(m){return smsg(conn,m)}},
chatRead:{value(jid,participant=conn.user.jid,messageID){return conn.sendReadReceipt(jid,participant,[messageID])},enumerable:true},
setStatus:{value(status){return conn.query({tag:'iq',attrs:{to:'s.whatsapp.net',type:'set',xmlns:'status',},content:[{tag:'status',attrs:{},content:Buffer.from(status,'utf-8')}]})},enumerable:true},
sendContact:{async value(jid,data,quoted,options){
if(!Array.isArray(data[0])&&typeof data[0]==='string')data=[data]
let contacts=[]
for(let[number,name]of data){
number=number.replace(/[^0-9]/g,'')
let njid=number+'@s.whatsapp.net'
let biz=await conn.getBusinessProfile(njid).catch(_=>null)||{}
let vcard=`BEGIN:VCARD\nVERSION:3.0\nN:;${name.replace(/\n/g,'\\n')};;;\nFN:${name.replace(/\n/g,'\\n')}\nTEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+'+number).getNumber('international')}${biz.description?`\nX-WA-BIZ-NAME:${(conn.chats[njid]?.vname||conn.getName(njid)||name).replace(/\n/,'\\n')}\nX-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g,'\\n')}\n`.trim():''}\nEND:VCARD`.trim()
contacts.push({vcard,displayName:name})}
return await conn.sendMessage(jid,{...options,contacts:{...options,displayName:(contacts.length>=2?`${contacts.length} kontak`:contacts[0].displayName)||null,contacts,}},{quoted,...options})},enumerable:true},
resize:{async value(image,width,height){let oyy=await Jimp.read(image);let kiyomasa=await oyy.resize(width,height).getBufferAsync(Jimp.MIME_JPEG);return kiyomasa}},
generateProfilePicture:{async value(buffer){
const jimp_1=await Jimp.read(buffer)
const resz=jimp_1.getWidth()>jimp_1.getHeight()?jimp_1.resize(550,Jimp.AUTO):jimp_1.resize(Jimp.AUTO,650)
const jimp_2=await Jimp.read(await resz.getBufferAsync(Jimp.MIME_JPEG))
return{img:await resz.getBufferAsync(Jimp.MIME_JPEG)}}},
sendText:{async value(jid,text,quoted='',options){conn.sendMessage(jid,{text:text,...options},{quoted})}},
sendAdd:{value(jid,text='',title=global.wm,bodi=global.sgc,url,quoted,options){conn.sendMessage(jid,{text:text,contextInfo:{"externalAdReply":{"title":title,"body":bodi,"showAdAttribution":true,"mediaType":1,"sourceUrl":'',"thumbnailUrl":url,"renderLargerThumbnail":true}}},{quoted,...options})}},
reply:{value(jid,text='',quoted,options){return Buffer.isBuffer(text)?conn.sendFile(jid,text,'file','',quoted,false,options):conn.sendMessage(jid,{...options,text},{quoted,...options})}},
sendBot:{async value(jid,text='',buffer,title,body,url,quoted,options){
if(buffer)try{let type=await conn.getFile(buffer);buffer=type.data}catch{buffer=buffer}
let prep=generateWAMessageFromContent(jid,{extendedTextMessage:{text:text,contextInfo:{externalAdReply:{title:title,body:body,thumbnail:buffer,sourceUrl:url},mentionedJid:await conn.parseMention(text)}}},{quoted:quoted})
return conn.relayMessage(jid,prep.message,{messageId:prep.key.id})}},
sendPayment:{async value(jid,amount,text,quoted,options){conn.relayMessage(jid,{requestPaymentMessage:{currencyCodeIso4217:'PEN',amount1000:amount,requestFrom:null,noteMessage:{extendedTextMessage:{text:text,contextInfo:{externalAdReply:{showAdAttribution:true},mentionedJid:conn.parseMention(text)}}}}},{})}},
sendMini:{async value(jid,title,body,text='',thumbnailUrl,thumbnail,sourceUrl,quoted,LargerThumbnail=true){return conn.sendMessage(jid,{...{contextInfo:{mentionedJid:await conn.parseMention(text),externalAdReply:{title:title,body:body,mediaType:1,previewType:0,renderLargerThumbnail:LargerThumbnail,thumbnailUrl:thumbnailUrl,thumbnail:thumbnailUrl,sourceUrl:sourceUrl}}},text},{quoted})},enumerable:true,writable:true},
sendCarousel:{async value(jid,text='',footer='',text2='',messages,quoted,options){
if(messages.length>1){
const cards=await Promise.all(messages.map(async([text='',footer='',buffer,buttons,copy,urls,list])=>{
let img,video;
if(/^https?:\/\//i.test(buffer)){
try{
const response=await fetch(buffer);
const contentType=response.headers.get('content-type');
if(/^image\//i.test(contentType)){img=await prepareWAMessageMedia({image:{url:buffer}},{upload:conn.waUploadToServer,...options});}else if(/^video\//i.test(contentType)){video=await prepareWAMessageMedia({video:{url:buffer}},{upload:conn.waUploadToServer,...options});}else{console.error("Incompatible MIME types:",contentType);}
}catch(error){console.error("Failed to get MIME type:",error);}
}else{
try{
const type=await conn.getFile(buffer);
if(/^image\//i.test(type.mime)){img=await prepareWAMessageMedia({image:(/^https?:\/\//i.test(buffer))?{url:buffer}:(type&&type?.data)},{upload:conn.waUploadToServer,...options});
}else if(/^video\//i.test(type.mime)){video=await prepareWAMessageMedia({video:(/^https?:\/\//i.test(buffer))?{url:buffer}:(type&&type?.data)},{upload:conn.waUploadToServer,...options});}
}catch(error){console.error("Failed to get file type:",error);}
}
const dynamicButtons=buttons.map(btn=>({name:'quick_reply',buttonParamsJson:JSON.stringify({display_text:btn[0],id:btn[1]}),}));
copy=Array.isArray(copy)?copy:[copy]
copy.map(copy=>{dynamicButtons.push({name:'cta_copy',buttonParamsJson:JSON.stringify({display_text:'Copy',copy_code:copy[0]})});});
urls?.forEach(url=>{dynamicButtons.push({name:'cta_url',buttonParamsJson:JSON.stringify({display_text:url[0],url:url[1],merchant_url:url[1]})});});
list?.forEach(lister=>{dynamicButtons.push({name:'single_select',buttonParamsJson:JSON.stringify({title:lister[0],sections:lister[1]})});})
return{body:proto.Message.InteractiveMessage.Body.fromObject({text:text||''}),footer:proto.Message.InteractiveMessage.Footer.fromObject({text:footer||global.wm}),header:proto.Message.InteractiveMessage.Header.fromObject({title:text2,subtitle:text||'',hasMediaAttachment:img?.imageMessage||video?.videoMessage?true:false,imageMessage:img?.imageMessage||null,videoMessage:video?.videoMessage||null}),nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({buttons:dynamicButtons.filter(Boolean),messageParamsJson:''}),...Object.assign({mentions:typeof text==='string'?conn.parseMention(text||'@0'):[],contextInfo:{mentionedJid:typeof text==='string'?conn.parseMention(text||'@0'):[],}},{...(options||{}),...(conn.temareply?.contextInfo&&{contextInfo:{...(options?.contextInfo||{}),...conn.temareply?.contextInfo,externalAdReply:{...(options?.contextInfo?.externalAdReply||{}),...conn.temareply?.contextInfo?.externalAdReply,},},})})};}));
const interactiveMessage=proto.Message.InteractiveMessage.create({body:proto.Message.InteractiveMessage.Body.fromObject({text:text||''}),footer:proto.Message.InteractiveMessage.Footer.fromObject({text:footer||global.wm}),header:proto.Message.InteractiveMessage.Header.fromObject({title:text||'',subtitle:text||'',hasMediaAttachment:false}),carouselMessage:proto.Message.InteractiveMessage.CarouselMessage.fromObject({cards,}),...Object.assign({mentions:typeof text==='string'?conn.parseMention(text||'@0'):[],contextInfo:{mentionedJid:typeof text==='string'?conn.parseMention(text||'@0'):[],}},{...(options||{}),...(conn.temareply?.contextInfo&&{contextInfo:{...(options?.contextInfo||{}),...conn.temareply?.contextInfo,externalAdReply:{...(options?.contextInfo?.externalAdReply||{}),...conn.temareply?.contextInfo?.externalAdReply,},},})})});
const messageContent=proto.Message.fromObject({viewOnceMessage:{message:{messageContextInfo:{deviceListMetadata:{},deviceListMetadataVersion:2},interactiveMessage}}});
const msgs=await generateWAMessageFromContent(jid,messageContent,{userJid:conn.user.jid,quoted:quoted,upload:conn.waUploadToServer,ephemeralExpiration:WA_DEFAULT_EPHEMERAL});
await conn.relayMessage(jid,msgs.message,{messageId:msgs.key.id});
}else{await conn.sendNCarousel(jid,...messages[0],quoted,options);}}},
sendThumb:{value(jid,text='',url,quoted,options){conn.sendMessage(jid,{text:text,contextInfo:{"externalAdReply":{"title":global.namebot,"body":'',"showAdAttribution":true,"mediaType":1,"sourceUrl":'',"thumbnailUrl":url,"renderLargerThumbnail":true}}},{quoted,...options})}},
sendAllButtons:{async value(jid,options={},quoted=null){
let actualJid=jid
let actualOptions=options
let actualQuoted=quoted
if(typeof jid!=='string'&&typeof options==='object'){
actualQuoted=options
actualOptions=jid
actualJid=actualOptions.jid
}
if(!actualJid&&actualQuoted?.key?.remoteJid){
actualJid=actualQuoted.key.remoteJid
}
const{text="",footer=global.wm,title=global.botname,image,video,buttons=[],copyButtons=[],urlButtons=[],listButtons=[],callButtons=[],locationButton,productsButton,translate=true}=actualOptions
let finalText=text
let finalFooter=footer
let finalTitle=title
if(translate&&actualQuoted){
try{
const{smartTranslate}=await import('./language.js').catch(()=>({}))
if(smartTranslate){
const fakeM={
sender:actualQuoted.key?.participant||actualQuoted.key?.remoteJid,
chat:actualQuoted.key?.remoteJid
}
if(text)finalText=await smartTranslate(fakeM,text,{decorate:false})
if(footer)finalFooter=await smartTranslate(fakeM,footer,{decorate:false})
if(title)finalTitle=await smartTranslate(fakeM,title,{decorate:false})
}
}catch(e){console.error('❌ خطأ في ترجمة النصوص:',e)}
}
let preparedMedia=null
if(image){
try{
preparedMedia=await prepareWAMessageMedia({image:{url:image}},{upload:this.waUploadToServer})
}catch(e){console.error('❌ خطأ في تحضير الصورة:',e)}
}else if(video){
try{
preparedMedia=await prepareWAMessageMedia({video:{url:video}},{upload:this.waUploadToServer})
}catch(e){console.error('❌ خطأ في تحضير الفيديو:',e)}
}
let allButtons=[]
const translateButtonText=async(text)=>{
if(!translate||!actualQuoted)return`✦ ${text} ✦`
try{
const{smartTranslate}=await import('./language.js').catch(()=>({}))
if(smartTranslate){
const fakeM={
sender:actualQuoted.key?.participant||actualQuoted.key?.remoteJid,
chat:actualQuoted.key?.remoteJid
}
const translated=await smartTranslate(fakeM,text,{decorate:false})
return`✦ ${translated} ✦`
}
}catch(e){console.error('❌ خطأ في ترجمة الزر:',e)}
return`✦ ${text} ✦`
}
if(buttons.length>0){
for(const btn of buttons){
if(btn[0]&&btn[1]){
const displayText=await translateButtonText(btn[0])
allButtons.push({name:'quick_reply',buttonParamsJson:JSON.stringify({display_text:displayText,id:btn[1]})})
}}
}
if(copyButtons.length>0){
for(const copy of copyButtons){
if(copy[0]&&copy[1]){
const displayText=await translateButtonText(copy[0])
allButtons.push({name:'cta_copy',buttonParamsJson:JSON.stringify({display_text:displayText,copy_code:copy[1]})})
}}
}
if(urlButtons.length>0){
for(const url of urlButtons){
if(url[0]&&url[1]){
const displayText=await translateButtonText(url[0])
allButtons.push({name:'cta_url',buttonParamsJson:JSON.stringify({display_text:displayText,url:url[1],merchant_url:url[1]})})
}}
}
if(listButtons.length>0){
for(const list of listButtons){
if(list[0]&&list[1]){
let listTitle=list[0]
let listSections=list[1]
if(translate&&actualQuoted){
try{
const{smartTranslate}=await import('./language.js').catch(()=>({}))
if(smartTranslate){
const fakeM={sender:actualQuoted.key?.participant||actualQuoted.key?.remoteJid,chat:actualQuoted.key?.remoteJid}
listTitle=await smartTranslate(fakeM,listTitle,{decorate:false})
if(Array.isArray(listSections)){
for(const section of listSections){
if(section.title)section.title=await smartTranslate(fakeM,section.title,{decorate:false})
if(Array.isArray(section.rows)){
for(const row of section.rows){
if(row.title)row.title=await smartTranslate(fakeM,row.title,{decorate:false})
if(row.description)row.description=await smartTranslate(fakeM,row.description,{decorate:false})
}}
}}
}
}catch(e){console.error('❌ خطأ في ترجمة القائمة:',e)}
}
allButtons.push({name:'single_select',buttonParamsJson:JSON.stringify({title:listTitle,sections:listSections})})
}}
}
if(callButtons.length>0){
for(const call of callButtons){
if(call[0]&&call[1]){
const displayText=await translateButtonText(call[0])
allButtons.push({name:'cta_call',buttonParamsJson:JSON.stringify({display_text:displayText,phone_number:call[1]})})
}}
}
if(locationButton){
const displayText=await translateButtonText(locationButton)
allButtons.push({name:'send_location',buttonParamsJson:JSON.stringify({display_text:displayText})})
}
if(productsButton){
const displayText=await translateButtonText(productsButton)
allButtons.push({name:'catalog_message',buttonParamsJson:JSON.stringify({display_text:displayText})})
}
const interactiveMessage={body:{text:finalText},footer:{text:finalFooter},header:{title:finalTitle,hasMediaAttachment:!!preparedMedia,...(preparedMedia&&{...(image?{imageMessage:preparedMedia.imageMessage}:{}),...(video?{videoMessage:preparedMedia.videoMessage}:{})})},nativeFlowMessage:{buttons:allButtons}}
const messageContent={viewOnceMessage:{message:{messageContextInfo:{deviceListMetadata:{},deviceListMetadataVersion:2},interactiveMessage}}}
try{
const msg=generateWAMessageFromContent(actualJid,messageContent,{quoted:actualQuoted,userJid:this.user.jid})
await this.relayMessage(actualJid,msg.message,{messageId:msg.key.id})
return msg
}catch(error){
console.error('❌ خطأ في sendAllButtons:',error)
throw error
}
},
enumerable:true
}
})
if(sock.user?.id)sock.user.jid=sock.decodeJid(sock.user.id)
store.bind(sock)
return sock
}

export function smsg(conn,m,hasParent){if(!m)return m;let M=proto.WebMessageInfo;m=M.fromObject(m);m.conn=conn;let protocolMessageKey;if(m.message){if(m.mtype=='protocolMessage'&&m.msg.key){protocolMessageKey=m.msg.key;if(protocolMessageKey=='status@broadcast')protocolMessageKey.remoteJid=m.chat;if(!protocolMessageKey.participant||protocolMessageKey.participant=='status_me')protocolMessageKey.participant=m.sender;protocolMessageKey.fromMe=conn.decodeJid(protocolMessageKey.participant)===conn.decodeJid(conn.user.id);if(!protocolMessageKey.fromMe&&protocolMessageKey.remoteJid===conn.decodeJid(conn.user.id))protocolMessageKey.remoteJid=m.sender}if(m.quoted)if(!m.quoted.mediaMessage)delete m.quoted.download}if(!m.mediaMessage)delete m.download;try{if(protocolMessageKey&&m.mtype=='protocolMessage')conn.ev.emit('message.delete',protocolMessageKey)}catch(e){console.error(e)};return m}

export function serialize(){const MediaType=['imageMessage','videoMessage','audioMessage','stickerMessage','documentMessage'];return Object.defineProperties(proto.WebMessageInfo.prototype,{conn:{value:undefined,enumerable:false,writable:true},id:{get(){return this.key?.id}},isBaileys:{get(){return(this?.fromMe||areJidsSameUser(this.conn?.user.id,this.sender))&&this.id.startsWith('3EB0')&&(this.id.length===20||this.id.length===22||this.id.length===12)||false}},chat:{get(){const senderKeyDistributionMessage=this.message?.senderKeyDistributionMessage?.groupId;return(this.key?.remoteJid||(senderKeyDistributionMessage&&senderKeyDistributionMessage!=='status@broadcast')||'').decodeJid()}},isGroup:{get(){return this.chat.endsWith('@g.us')},enumerable:true},sender:{get(){return this.conn?.decodeJid(this.key?.fromMe&&this.conn?.user.id||this.participant||this.key.participant||this.chat||'')},enumerable:true},fromMe:{get(){return this.key?.fromMe||areJidsSameUser(this.conn?.user.id,this.sender)||false}},mtype:{get(){if(!this.message)return'';const type=Object.keys(this.message);return(!['senderKeyDistributionMessage','messageContextInfo'].includes(type[0])&&type[0])||(type.length>=3&&type[1]!=='messageContextInfo'&&type[1])||type[type.length-1]},enumerable:true},msg:{get(){if(!this.message)return null;return this.message[this.mtype]}},mediaMessage:{get(){if(!this.message)return null;const Message=((this.msg?.url||this.msg?.directPath)?{...this.message}:extractMessageContent(this.message))||null;if(!Message)return null;const mtype=Object.keys(Message)[0];return MediaType.includes(mtype)?Message:null},enumerable:true},mediaType:{get(){let message;if(!(message=this.mediaMessage))return null;return Object.keys(message)[0]},enumerable:true},quoted:{get(){const self=this;const msg=self.msg;const contextInfo=msg?.contextInfo;const quoted=contextInfo?.quotedMessage;if(!msg||!contextInfo||!quoted)return null;const type=Object.keys(quoted)[0];let q=quoted[type];const text=typeof q==='string'?q:q.text;return Object.defineProperties(JSON.parse(JSON.stringify(typeof q==='string'?{text:q}:q)),{mtype:{get(){return type},enumerable:true},mediaMessage:{get(){const Message=((q.url||q.directPath)?{...quoted}:extractMessageContent(quoted))||null;if(!Message)return null;const mtype=Object.keys(Message)[0];return MediaType.includes(mtype)?Message:null},enumerable:true},mediaType:{get(){let message;if(!(message=this.mediaMessage))return null;return Object.keys(message)[0]},enumerable:true},id:{get(){return contextInfo.stanzaId},enumerable:true},chat:{get(){return contextInfo.remoteJid||self.chat},enumerable:true},isBaileys:{get(){return(this?.fromMe||areJidsSameUser(this.conn?.user.id,this.sender))&&this.id.startsWith('3EB0')&&(this.id.length===20||this.id.length===22||this.id.length===12)||false},enumerable:true},sender:{get(){return(contextInfo.participant||this.chat||'').decodeJid()},enumerable:true},fromMe:{get(){return areJidsSameUser(this.sender,self.conn?.user.jid)},enumerable:true},text:{get(){return text||this.caption||this.contentText||this.selectedDisplayText||''},enumerable:true},mentionedJid:{get(){return q.contextInfo?.mentionedJid||self.getQuotedObj()?.mentionedJid||[]},enumerable:true},name:{get(){const sender=this.sender;return sender?self.conn?.getName(sender):null},enumerable:true},vM:{get(){return proto.WebMessageInfo.fromObject({key:{fromMe:this.fromMe,remoteJid:this.chat,id:this.id},message:quoted,...(self.isGroup?{participant:this.sender}:{})})}},fakeObj:{get(){return this.vM}},download:{value(saveToFile=false){const mtype=this.mediaType;return self.conn?.downloadM(this.mediaMessage[mtype],mtype.replace(/message/i,''),saveToFile)},enumerable:true,configurable:true},reply:{value(text,chatId,options){return self.conn?.reply(chatId?chatId:this.chat,text,this.vM,options)},enumerable:true},copy:{value(){const M=proto.WebMessageInfo;return smsg(conn,M.fromObject(M.toObject(this.vM)))},enumerable:true},forward:{value(jid,force=false,options){return self.conn?.sendMessage(jid,{forward:this.vM,force,...options},{...options})},enumerable:true},copyNForward:{value(jid,forceForward=false,options){return self.conn?.copyNForward(jid,this.vM,forceForward,options)},enumerable:true},cMod:{value(jid,text='',sender=this.sender,options={}){return self.conn?.cMod(jid,this.vM,text,sender,options)},enumerable:true},delete:{value(){return self.conn?.sendMessage(this.chat,{delete:this.vM.key})},enumerable:true},react:{value(text){return self.conn?.sendMessage(this.chat,{react:{text,key:this.vM.key}})},enumerable:true}})},enumerable:true},_text:{value:null,writable:true},text:{get(){const msg=this.msg;const text=(typeof msg==='string'?msg:msg?.text)||msg?.caption||msg?.contentText||'';return typeof this._text==='string'?this._text:''||(typeof text==='string'?text:(text?.selectedDisplayText||text?.hydratedTemplate?.hydratedContentText||text))||''},set(str){return this._text=str},enumerable:true},mentionedJid:{get(){return this.msg?.contextInfo?.mentionedJid?.length&&this.msg.contextInfo.mentionedJid||[]},enumerable:true},name:{get(){return!nullish(this.pushName)&&this.pushName||this.conn?.getName(this.sender)},enumerable:true},download:{value(saveToFile=false){const mtype=this.mediaType;return this.conn?.downloadM(this.mediaMessage[mtype],mtype.replace(/message/i,''),saveToFile)},enumerable:true,configurable:true},reply:{value(text,chatId,options){return this.conn?.reply(chatId?chatId:this.chat,text,this,options)}},copy:{value(){const M=proto.WebMessageInfo;return smsg(this.conn,M.fromObject(M.toObject(this)))},enumerable:true},forward:{value(jid,force=false,options={}){return this.conn?.sendMessage(jid,{forward:this,force,...options},{...options})},enumerable:true},copyNForward:{value(jid,forceForward=false,options={}){return this.conn?.copyNForward(jid,this,forceForward,options)},enumerable:true},cMod:{value(jid,text='',sender=this.sender,options={}){return this.conn?.cMod(jid,this,text,sender,options)},enumerable:true},getQuotedObj:{value(){if(!this.quoted.id)return null;const q=proto.WebMessageInfo.fromObject(this.conn?.loadMessage(this.quoted.id)||this.quoted.vM);return smsg(this.conn,q)},enumerable:true},getQuotedMessage:{get(){return this.getQuotedObj}},delete:{value(){return this.conn?.sendMessage(this.chat,{delete:this.key})},enumerable:true},react:{value(text){return this.conn?.sendMessage(this.chat,{react:{text,key:this.key}})},enumerable:true}})}

export function logic(check,inp,out){if(inp.length!==out.length)throw new Error('Input and Output must have same length');for(let i in inp)if(util.isDeepStrictEqual(check,inp[i]))return out[i];return null}

export function protoType(){
Buffer.prototype.toArrayBuffer=function toArrayBufferV2(){const ab=new ArrayBuffer(this.length);const view=new Uint8Array(ab);for(let i=0;i<this.length;++i){view[i]=this[i]};return ab}
Buffer.prototype.toArrayBufferV2=function toArrayBuffer(){return this.buffer.slice(this.byteOffset,this.byteOffset+this.byteLength)}
ArrayBuffer.prototype.toBuffer=function toBuffer(){return Buffer.from(new Uint8Array(this))}
Uint8Array.prototype.getFileType=ArrayBuffer.prototype.getFileType=Buffer.prototype.getFileType=async function getFileType(){return await fileTypeFromBuffer(this)}
String.prototype.isNumber=Number.prototype.isNumber=isNumber
String.prototype.capitalize=function capitalize(){return this.charAt(0).toUpperCase()+this.slice(1,this.length)}
String.prototype.capitalizeV2=function capitalizeV2(){const str=this.split(' ');return str.map(v=>v.capitalize()).join(' ')}
String.prototype.decodeJid=function decodeJid(){if(/:\d+@/gi.test(this)){const decode=jidDecode(this)||{};return(decode.user&&decode.server&&decode.user+'@'+decode.server||this).trim()}else return this.trim()}
Number.prototype.toTimeString=function toTimeString(){const seconds=Math.floor((this/1000)%60);const minutes=Math.floor((this/(60*1000))%60);const hours=Math.floor((this/(60*60*1000))%24);const days=Math.floor((this/(24*60*60*1000)));return((days?`${days} day(s) `:'')+(hours?`${hours} hour(s) `:'')+(minutes?`${minutes} minute(s) `:'')+(seconds?`${seconds} second(s)`:'')).trim()}
Number.prototype.getRandom=String.prototype.getRandom=Array.prototype.getRandom=getRandom
}