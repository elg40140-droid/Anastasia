import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
import { detectUserCountry } from './lib/language.js'
// 📱 رقم البوت
global.botNumber = '201551409038'
//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
// 👑 المالك والمميزين
global.owner = [
  ['201551409038', 'عضو مميز', true],
  ['201557409072', 'عضو مميز', true]
]
global.mods = ['201557409072']
global.suittag = ['201557409072']
global.prems = ['201551409038', '201557409072']
//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
// 📚 إعدادات المكتبة والإصدار
global.libreria = 'Baileys'
global.baileys = 'V 6.7.17'
global.vs = '3.0.0'
global.nameqr = global.botname
global.namebot = global.botname
global.sessions = 'Sessions'
global.jadi = 'JadiBots'
global.shadowJadibts = true
//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
// 🖌️ إعدادات العلامة التجارية
global.packname=global.author
global.botname='˚˚｡⋆୨🌺୧ ₳₦₳₴₮₳₴ł₳ ˚୨🌺୧⋆｡˚'
global.wm=global.botname
global.author='⩇⃟🔋ᎷᎪᎠᎬ ᏢᎽ 🌹⃟⃢👑 ĐÆ𝚪𝐊༒𝙎-𝙏𝞢𝞜🌹⃟⃢👑 ⩇⃟⚡'
global.dev='✧ 𖦹 ꇙ-꓄ꏂꋊ ⊹꙰ ꔛ ＸＹＺ ✧'
global.club='𓏲⍣⃝🌙꙰꙳ 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 ꇙ-꓄ꏂꋊ ꙳⍣⃝ ☻⋆͙̈✫.🪷'
global.textbot='𓏲⍣⃝🍧꙰꙳ ᎪΝᎪՏͲᎪՏᏆᎪ ✦ ꇙ-꓄ꏂꋊ ꙳⍣⃝☻⋆͙̈✫.⚽'
global.packsticker=`༺══•◈•══༻\n🍓.ೃ࿔*:･༓☾\n✿ المستخدم: ${global.nombre}\n✿ البوت: ${global.botname}\n☽༓･*:࿔ೃ.🎋\n༺══•◈•══༻`
global.packsticker2=global.dev
global.etiqueta='@ꇙ-꓄ꏂꋊ'
global.correo='elg40140@gmail.com'
//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
// 💰 العملة
global.moneda = 'ANASTASIA MONEY'
// 🖼️ الصور
global.banner = 'https://files.catbox.moe/fft2hr.jpg'
global.avatar = 'https://files.catbox.moe/js2plu.jpg'
global.logo = 'https://files.catbox.moe/fft2hr.jpg'
//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
// 🔗 الروابط
global.gp1 = 'https://chat.whatsapp.com/Hc3FiJ867E35OJ9KUHO2TI'
global.comunidad1 = 'https://chat.whatsapp.com/Hc3FiJ867E35OJ9KUHO2TI'
global.channel = 'https://whatsapp.com/channel/0029Vb5DF3H59PwKojA8O701/109x'
global.channel2 = 'https://whatsapp.com/channel/0029Vb5DF3H59PwKojA8O701/109x'
global.md = 'https://github.com/Yuji-XDev/Rin-Itoshi-Bot'

global.catalogo = fs.readFileSync('./src/catalogo.jpg')
global.estilo = {
  key: { fromMe: false, participant: '0@s.whatsapp.net', ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) },
  message: { orderMessage: { itemCount: -999999, status: 1, surface: 1, message: packname, orderTitle: 'كاتي', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net' }}
}
global.ch = {
  ch1: '120363401008003732@newsletter',
  ch2: '120363401008003732@newsletter',
  ch3: '120363401008003732@newsletter'
}
global.multiplier = 30
//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
// ⚙️ الأنظمة الافتراضية
global.systems={
translationMode: false, // وضع الترجمة في المجموعة
translationLang: 'ar', // لغة المجموعة
decorationStyle: 'no', // نمط زخرفة المجموعة
allowUserStyles: true, // السماح للأعضاء بتخصيص الزخرفة
simi:false, 
specialWelcome:true,
isBanned:false,
sAutoresponder:'',
welcome:true,
autoVn:false,
autoAceptar:false,
autosticker:false,
autoRechazar:false,
autoresponder:false,
autoApprove:false,
detect:true,
modoadmin:false,
antiLink:false, 
antiBot:false,
antiBot2:false,
antiLag:false,
antiver:true,
antidelete:false, 
antiporn:false,
antiAudio:false,
antiFoto:false,
antiSticker:false,
antiFile:false,
antivideo:false,
antitagsw:false,
antiToxic:false,
captcha:false, 
reaction:false,
audios:false,
nsfw:false,
expired:0,
primaryBot:null, 
per:[]
}

// 💎 الإعدادات الافتراضية للمستخدم
global.defaultUser = {
language: 'ar', // اللغة الافتراضية
decorationStyle: 'no', // نمط الزخرفة الافتراضي
fontStyle: null, // نمط الحروف (null يعني عادي)
autoTranslate: true, // الترجمة التلقائية
autoDecorate: true, // الزخرفة التلقائية
autolevelup: false,
exp: 0,
coin: 10,
joincount: 1,
diamond: 3,
lastadventure: 0,
lastclaim: 0,
health: 100,
crime: 0,
lastcofre: 0,
lastdiamantes: 0,
lastpago: 0,
lastcode: 0,
lastcodereg: 0,
lastduel: 0,
lastmining: 0,
muto: false,
premium: false,
premiumTime: 0,
registered: false,
genre: '',
birth: '',
marry: '',
description: '',
packstickers: null,
name: '',
age: -1,
regTime: -1,
afk: -1,
afkReason: '',
role: 'مبتدئ',
banned:false,
bannedReason:'',
bannedTime:0,
useDocument: false,
level: 0,
bank: 0,
warn: 0
}

// �️ الإعدادات الافتراضية للبوت
global.defaultSettings={
ngetik:true,
self:false,
restrict:true,
jadibotmd:true,
antiPrivate:false,
autoread:false,
autobio:true, 
autoJoin:false,
status:0,
antiarabe:false, 
antiSpam:false, 
anticall:true, 
monitorStories:true
}
//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
// 📦 المكتبات
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment
//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
// 🦋 دوال تحميل الإعدادات
export async function loadUserSettings(sender, m) {
if (!global.db.data.users) global.db.data.users = {}
let user = global.db.data.users[sender] || {}
if (!user.language) {
let countryInfo = detectUserCountry(sender)
user.language = countryInfo.language
}
if (m && m.name && !user.name) {user.name = m.name}
global.db.data.users[sender] = { ...global.defaultUser, ...user }
return global.db.data.users[sender]
}
export async function loadChatSettings(chatId) {
if (!global.db.data.chats) global.db.data.chats = {}
let chat = global.db.data.chats[chatId] || {}
global.db.data.chats[chatId] = { ...global.systems, ...chat }
return global.db.data.chats[chatId]
}
export async function loadBotSettings(botJid) {
if (!global.db.data.settings) global.db.data.settings = {}
let settings = global.db.data.settings[botJid] || {}
global.db.data.settings[botJid] = { ...global.defaultSettings, ...settings }
return global.db.data.settings[botJid]
}
// 🎯 دالة تحديث جميع الإعدادات
export async function reloadAllSettings() {
  console.log(chalk.cyan('🔄 تحديث الإعدادات...'))
// تحديث إعدادات المستخدمين
if (global.db.data.users) {
for (let sender in global.db.data.users) {
await loadUserSettings(sender)
}
}
// تحديث إعدادات المحادثات
if (global.db.data.chats) {
for (let chatId in global.db.data.chats) {
await loadChatSettings(chatId)
}
}
// تحديث إعدادات البوت
if (global.db.data.settings && global.conn?.user?.jid) {
await loadBotSettings(global.conn.user.jid)
}
}
//✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
// 🔄 تحديث الملف
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.magenta("🦋 تحديث 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})