// lib/language.js
import translate from '@vitalets/google-translate-api'

// 🌍 قاعدة بيانات كاملة للدول واللغات
const countryDatabase = {/*الشرق الأوسط وشمال أفريقيا*/'20': {code:'eg',language:'ar',name:'مصر',flag:'🇪🇬'},'966': {code:'sa',language:'ar',name:'السعودية',flag:'🇸🇦'},'971': {code:'ae',language:'ar',name:'الإمارات',flag:'🇦🇪'},'973': {code:'bh',language:'ar',name:'البحرين',flag:'🇧🇭'},'974': {code:'qa',language:'ar',name:'قطر',flag:'🇶🇦'},'965': {code:'kw',language:'ar',name:'الكويت',flag:'🇰🇼'},'968': {code:'om',language:'ar',name:'عمان',flag:'🇴🇲'},'962': {code:'jo',language:'ar',name:'الأردن',flag:'🇯🇴'},'963': {code:'sy',language:'ar',name:'سوريا',flag:'🇸🇾'},'961': {code:'lb',language:'ar',name:'لبنان',flag:'🇱🇧'},'964': {code:'iq',language:'ar',name:'العراق',flag:'🇮🇶'},'967': {code:'ye',language:'ar',name:'اليمن',flag:'🇾🇪'},'212': {code:'ma',language:'ar',name:'المغرب',flag:'🇲🇦'},'213': {code:'dz',language:'ar',name:'الجزائر', flag:'🇩🇿'},'216': {code:'tn',language:'ar',name:'تونس',flag:'🇹🇳'},'218': {code:'ly',language:'ar',name:'ليبيا',flag:'🇱🇾'},'222': {code:'mr',language:'ar',name:'موريتانيا',flag:'🇲🇷'},'249': {code:'sd',language:'ar',name:'السودان',flag:'🇸🇩'},'252': {code:'so',language:'so',name:'الصومال',flag:'🇸🇴'},/*أوروبا*/'44': {code:'gb',language:'en',name:'بريطانيا',flag:'🇬🇧'},'33': {code:'fr',language:'fr',name:'فرنسا',flag:'🇫🇷'},'49': {code:'de',language:'de',name:'ألمانيا',flag:'🇩🇪'},'39': {code:'it',language:'it',name:'إيطاليا',flag:'🇮🇹'},'34': {code:'es',language:'es',name:'إسبانيا',flag:'🇪🇸'},'351': {code:'pt',language:'pt',name:'البرتغال',flag:'🇵🇹'},'31': {code:'nl',language:'nl',name:'هولندا',flag:'🇳🇱'},'32': {code:'be',language:'nl',name:'بلجيكا',flag:'🇧🇪'},'41': {code:'ch',language:'de',name:'سويسرا',flag:'🇨🇭'},'43': {code:'at',language:'de',name:'النمسا',flag:'🇦🇹'},'46': {code:'se',language:'sv',name:'السويد',flag:'🇸🇪'},'47': {code:'no',language:'no',name:'النرويج',flag:'🇳🇴'},'45': {code:'dk',language:'da',name:'الدنمارك',flag:'🇩🇰'},'358': {code:'fi',language:'fi',name:'فنلندا',flag:'🇫🇮'},'30': {code:'gr',language:'el',name:'اليونان',flag:'🇬🇷'},'48': {code:'pl',language:'pl',name:'بولندا',flag:'🇵🇱'},'36': {code:'hu',language:'hu',name:'المجر',flag:'🇭🇺'},'40': {code:'ro',language:'ro',name:'رومانيا',flag:'🇷🇴'},'420': {code:'cz',language:'cs',name:'التشيك',flag:'🇨🇿'},'421': {code:'sk',language:'sk',name:'سلوفاكيا',flag:'🇸🇰'},/*الأمريكتين*/'1': {code:'us',language:'en',name:'أمريكا/كندا',flag:'🇺🇸'},'55': {code:'br',language:'pt',name:'البرازيل',flag:'🇧🇷'},'54': {code:'ar',language:'es',name:'الأرجنتين',flag:'🇦🇷'},'52': {code:'mx',language:'es',name:'المكسيك',flag:'🇲🇽'},'56': {code:'cl',language:'es',name:'تشيلي',flag:'🇨🇱'},'57': {code:'co',language:'es',name:'كولومبيا',flag:'🇨🇴'},'51': {code:'pe',language:'es',name:'بيرو',flag:'🇵🇪'},'58': {code:'ve',language:'es',name:'فنزويلا',flag:'🇻🇪'},/*آسيا*/'91': {code:'in',language:'hi',name:'الهند',flag:'🇮🇳'},'86': {code:'cn',language:'zh',name:'الصين',flag:'🇨🇳'},'81': {code:'jp',language:'ja',name:'اليابان',flag:'🇯🇵'},'82': {code:'kr',language:'ko',name:'كوريا الجنوبية',flag:'🇰🇷'},'65': {code:'sg',language:'en',name:'سنغافورة',flag:'🇸🇬'},'60': {code:'my',language:'ms',name:'ماليزيا',flag:'🇲🇾'},'62': {code:'id',language:'id',name:'إندونيسيا',flag:'🇮🇩'},'63': {code:'ph',language:'tl',name:'الفلبين',flag:'🇵🇭'},'66': {code:'th',language:'th',name:'تايلاند',flag:'🇹🇭'},'84': {code:'vn',language:'vi',name:'فيتنام',flag:'🇻🇳'},'90': {code:'tr',language:'tr',name:'تركيا',flag:'🇹🇷'},'98': {code:'ir',language:'fa',name:'إيران',flag:'🇮🇷'},'92': {code:'pk',language:'ur',name:'باكستان',flag:'🇵🇰'},'93': {code:'af',language:'ps',name:'أفغانستان',flag:'🇦🇫'},/*أفريقيا*/'234': {code:'ng',language:'en',name:'نيجيريا',flag:'🇳🇬'},'254': {code:'ke',language:'sw',name:'كينيا',flag:'🇰🇪'},'233': {code:'gh',language:'en',name:'غانا',flag:'🇬🇭'},'27': {code:'za',language:'en',name:'جنوب أفريقيا',flag:'🇿🇦'},'251': {code:'et',language:'am',name:'إثيوبيا',flag:'🇪🇹'},'256': {code:'ug',language:'en',name:'أوغندا',flag:'🇺🇬'},'225': {code:'ci',language:'fr',name:'ساحل العاج',flag:'🇨🇮'},/*أوقيانوسيا*/'61': {code:'au',language:'en',name:'أستراليا',flag:'🇦🇺'},'64': {code:'nz',language:'en',name:'نيوزيلندا',flag:'🇳🇿'}}

// 🆕 مكتبة الزخارف العربية
const ARABIC_DECORATION_STYLES = {
no: {start: "", end: "", line: "", bullet: ""},
a1:{start: "*╮─ׅ─๋︩︪─┈ ─๋︩︪─═⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ*\n│˼ೄྀ˹ ",end: " ╿↶\n*╯─ׅ─๋︩︪─┈ ─๋︩︪─═⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ*",line: "> ·˚ ༘₊· ͟͟͞͞꒰➳",bullet: "ˏˋ°•*⁀➷"},
a2:{start: "*══✿═╡°˖✧✿✧˖°╞═✿══*\n",end: "\n*....::::•°❄❇☸❇❄°•::::....*",line: "> ═✿╡°˖",bullet: "❇☸❇"},
a3:{start: "*꒷︶꒷꒥˚꒷︶꒷꒥꒷‧꒷︶꒷꒥꒷‧*\n",end: "\n*꒷︶꒷꒥˚꒷︶꒷꒥꒷‧꒷︶꒷꒥˚꒷‧*",line: "> ·˚ ༘₊· ͟͟͞͞꒰➳",bullet: "ˏˋ°•*⁀➷"}, 
a4:{start: "*꒷︶꒥꒷‧₊˚૮꒰˵•ᵜ•˵꒱ა‧₊˚꒷︶꒥꒷*\n",end: "\n*:♡.•♬✧⁽⁽ଘ( ˊᵕˋ )ଓ⁾⁾:•∴*",line: "> ꒷︶꒥꒷‧",bullet: "૮꒰˵•ᵜ•˵꒱ა"},
a5:{start: "*╼━━━━━➢━━━━━━╾*\n",end: "\n*╼━━━━━━➢━━━━━━━━╾*",line: "> ·˚ ༘₊· ͟͟͞͞꒰➳",bullet: "ˏˋ°•*⁀➷"},
a6:{start: "*ೋ❀ೋ═ ❀ ═ೋ❀ೋ*\n",end: "\n*──ೋღ 🌺 ღೋ──*",line: "> ೋ❀",bullet: "ღೋღ"}
}

// 🆕 مكتبة تزيين الحروف العربية
const ARABIC_FONT_STYLES = {
normal: {}, // الحروف العادية
dots: {'ا': 'اℓ', 'ب': 'بٚ', 'ت': 'ت', 'ث': 'ثٰ', 'ج': 'ج̀', 'ح': 'ح͓֘', 'خ': 'خٖ', 'د': 'د', 'ذ': 'ذ', 'ر': 'ࢪ', 'ز': 'ز', 'س': 'س͓', 'ش': 'شٓ', 'ص': 'ص', 'ض': 'ض', 'ط': 'ط֘', 'ظ': 'ظ', 'ع': 'ع', 'غ': 'غ', 'ف': 'ٓ֘ف', 'ق': 'ق', 'ك': 'ڴ', 'ل': 'ل', 'م': 'م͜', 'ن': 'نُ', 'ه': 'ه̐⃝ہ', 'و': 'ۅٖٚ͜', 'ي': 'ي͡'},
decorative: {'ا': 'ٱﺂ', 'ب': 'بٰ', 'ت': 'ت', 'ث': 'ث', 'جٰ': 'جٰ', 'ح': 'حٖ֘ٚ', 'خ': 'خ٘', 'د': 'د', 'ذ': 'ذ', 'ر': 'ࢪ', 'ز': 'ز', 'س': 'سؔ', 'ش': 'شِ', 'ص': 'صّ', 'ض': 'ضْ', 'ط': 'ط', 'ظ': 'ظ', 'ع': 'عٓ', 'غ': 'غٓ', 'ف': 'فْٖ', 'ق': 'قٖٚ', 'ك': 'ڪٓ', 'ل': 'ل', 'م': 'مۘ', 'ن': 'نٚ', 'ه': 'ه̐ہ', 'و': 'وٰ٘', 'ي': 'ي٘'},
kashida: {'ا': 'ٱ', 'ب': 'ب', 'ت': 'ت', 'ث': 'ث', 'ج': 'ج', 'ح': 'حَ', 'خ': 'خٖ', 'د': 'د', 'ذ': 'ذ', 'ر': 'ࢪ', 'ز': 'ز', 'س': 'سۣ', 'ش': 'ش', 'ص': 'صَ', 'ض': 'ض', 'ط': 'ط', 'ظ': 'ظ', 'ع': 'ع', 'غ': 'غٍ', 'ف': 'فٖ', 'ق': 'ق', 'ك': 'ڪَ', 'ل': 'لۧ', 'م': 'مٰ', 'ن': 'ۜن', 'ه': 'ه', 'و': 'و͜', 'ي': 'ي'}
}

// 🆕 أنماط تزيين الحروف
const FONT_STYLES={
bold:{A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭',a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',0:'𝟬',1:'𝟭',2:'𝟮',3:'𝟯',4:'𝟰',5:'𝟱',6:'𝟲',7:'𝟳',8:'𝟴',9:'𝟯'},
italic:{A:'𝘈',B:'𝘉',C:'𝘊',D:'𝘋',E:'𝘌',F:'𝘍',G:'𝘎',H:'𝘏',I:'𝘐',J:'𝘑',K:'𝘒',L:'𝘓',M:'𝘔',N:'𝘕',O:'𝘖',P:'𝘗',Q:'𝘘',R:'𝘙',S:'𝘚',T:'𝘛',U:'𝘜',V:'𝘝',W:'𝘞',X:'𝘟',Y:'𝘠',Z:'𝘡',a:'𝘢',b:'𝘣',c:'𝘤',d:'𝘥',e:'𝘦',f:'𝘧',g:'𝘨',h:'𝘩',i:'𝘪',j:'𝘫',k:'𝘬',l:'𝘭',m:'𝘮',n:'𝘯',o:'𝘰',p:'𝘱',q:'𝘲',r:'𝘳',s:'𝘴',t:'𝘵',u:'𝘶',v:'𝘷',w:'𝘸',x:'𝘹',y:'𝘺',z:'𝘻'},
script:{A:'𝒜',B:'𝐵',C:'𝒞',D:'𝒟',E:'𝐸',F:'𝐹',G:'𝒢',H:'𝐻',I:'𝐼',J:'𝒥',K:'𝒦',L:'𝐿',M:'𝑀',N:'𝒩',O:'𝒪',P:'𝒫',Q:'𝒬',R:'𝑅',S:'𝒮',T:'𝒯',U:'𝒰',V:'𝒱',W:'𝒲',X:'𝒳',Y:'𝒴',Z:'𝒵',a:'𝒶',b:'𝒷',c:'𝒸',d:'𝒹',e:'𝑒',f:'𝑓',g:'𝑔',h:'𝒽',i:'𝒾',j:'𝒿',k:'𝓀',l:'𝓁',m:'𝓂',n:'𝓃',o:'𝑜',p:'𝓅',q:'𝓆',r:'𝓇',s:'𝓈',t:'𝓉',u:'𝓊',v:'𝓋',w:'𝓌',x:'𝓍',y:'𝓎',z:'𝓏'},
gothic:{A:'𝔄',B:'𝔅',C:'ℭ',D:'𝔇',E:'𝔈',F:'𝔉',G:'𝔊',H:'ℌ',I:'ℑ',J:'𝔍',K:'𝔎',L:'𝔏',M:'𝔐',N:'𝔑',O:'𝔒',P:'𝔓',Q:'𝔔',R:'ℜ',S:'𝔖',T:'𝔗',U:'𝔘',V:'𝔙',W:'𝔚',X:'𝔛',Y:'𝔜',Z:'ℨ',a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷'},
double:{A:'𝔸',B:'𝔹',C:'ℂ',D:'𝔻',E:'𝔼',F:'𝔽',G:'𝔾',H:'ℍ',I:'𝕀',J:'𝕁',K:'𝕂',L:'𝕃',M:'𝕄',N:'ℕ',O:'𝕆',P:'ℙ',Q:'ℚ',R:'ℝ',S:'𝕊',T:'𝕋',U:'𝕌',V:'𝕍',W:'𝕎',X:'𝕏',Y:'𝕐',Z:'ℤ',a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫'},
monospace:{A:'𝙰',B:'𝙱',C:'𝙲',D:'𝙳',E:'𝙴',F:'𝙵',G:'𝙶',H:'𝙷',I:'𝙸',J:'𝙹',K:'𝙺',L:'𝙻',M:'𝙼',N:'𝙽',O:'𝙾',P:'𝙿',Q:'𝚀',R:'𝚁',S:'𝚂',T:'𝚃',U:'𝚄',V:'𝚅',W:'𝚆',X:'𝚇',Y:'𝚈',Z:'𝚉',a:'𝚊',b:'𝚋',c:'𝚌',d:'𝚍',e:'𝚎',f:'𝚏',g:'𝚐',h:'𝚑',i:'𝚒',j:'𝚓',k:'𝚔',l:'𝚕',m:'𝚖',n:'𝚗',o:'𝚘',p:'𝚙',q:'𝚚',r:'𝚛',s:'𝚜',t:'𝚝',u:'𝚞',v:'𝚟',w:'𝚠',x:'𝚡',y:'𝚢',z:'𝚣'}
}

// 🆕 أنماط الزخرفة
const DECORATION_STYLES={
no:{start:"",end:"",line:"",bullet:""},
nature:{start:"🌿┊❏•°•» 🌸 «•°•❏┊🌿\n",end:"\n🌿┊❏•°•» 🌸 «•°•❏┊🌿",line:"> ┊",bullet:"🌸"},
m1:{start: "*✩̣̣̣̣̣ͯ┄•͙✧⃝•͙┄✩ͯ•͙͙✧⃝•͙͙✩ͯ┄•͙✧⃝•͙┄✩̣̣̣*̣̣ͯ\n",end: "\n*✩̣̣̣̣̣ͯ┄•͙✧⃝•͙┄✩ͯ•͙͙✧⃝•͙͙✩ͯ┄•͙✧⃝•͙┄✩̣̣̣̣̣ͯ*",line: "> ✩ͯ┄•͙✧⃝•͙",bullet: "✧⃝•͙͙"},
m2:{start: "*█ ✪ █▓▓▓▓▓▓█ ✪ █*\n",end: "*▅▄▃▁▁▁▁▁▁▁▂▃▄▅*\n",line: "> █▓",bullet: "█✪█"},
m3:{start: "*█▒▒▒▒█  ◈  █▒▒▒▒█*\n",end: "\n*❢◥ ▬▬▬ ◆ ▬▬▬ ◤❢*",line: "> █▒▒",bullet: "█◈█"},
m4:{start: "*━━━━。゜✿ฺ✿ฺ゜。━━━━*\n",end: "\n*✧▬▭▬ ▬ ✦✧✦ ▬ ▬▭▬✧*",line: "> ━。゜✿",bullet: "✦✧✦"},
m5:{start: "*»»-------------¤-------------««*\n",end: "\n·* · ───── ·𖥸· ───── · ·*",line: "> »»----¤",bullet: "·𖥸·"},
m6:{start: "*❁≖≖✿❁ ≖≖✿❁ ≖≖✿❁ ≖≖❁*\n",end: "\n*✼ •• ┈┈┈๑⋅⋯ ୨˚୧ ⋯⋅๑┈┈┈ •• ✼*",line: "> ❁ ≖≖✿❁",bullet: " ୨˚୧ "},
m7:{start: "*▬▬ι═════════════ι▬▬*\n",end: "\n*¤━━━¤°¤━¤°¤━¤°¤━━━¤*",line: "> ▬▬ι",bullet: "¤°¤"},
m8:{start: "*♪°•°∞°•°♪°•°∞°•°♪°•°∞°•°♪°•°∞°•°♪*\n",end: "\n*¸¸♬·¯·♩¸¸♪·¯·♫¸¸¸♬·¯·♩¸¸♪·¯·♫¸¸*",line: "> ♪°•°∞",bullet: "·♩¸¸♪·"},
m9:{start: "*┈┈┈┈․° ☣ °․┈┈┈┈*\n",end: "\n*》* 。 • ˚ ˚ ˛ ˚ ˛ • 。* 。 • ˚《*",line: "> ┈┈․°",bullet: "☣"},
m10:{start: "*╮─ׅ─๋︩︪─┈ ─๋︩︪─═⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ*\n│˼ೄྀ˹ ",end: " ╿↶\n*╯─ׅ─๋︩︪─┈ ─๋︩︪─═⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ*",line: "> ·˚ ༘₊· ͟͟͞͞꒰➳",bullet: "ˏˋ°•*⁀➷"},
m11:{start: "*—— ☆ • ♧ • ♤ • ♧ • ☆ ——*\n",end: "\n*✿°•∘ɷ∘•°✿. ✿°•∘ɷ∘•°✿ ✿°•∘ɷ∘•°✿*",line: "> ———☆",bullet: "°•∘ɷ∘•°"},
m12:{start: "*══✿═╡°˖✧✿✧˖°╞═✿══*\n",end: "\n*....::::•°❄❇☸❇❄°•::::....*",line: "> ═✿╡°˖",bullet: "❇☸❇"},
m13:{start: "*─✱*.｡:｡*.:｡✧*.｡✰*.:｡✧*.｡:｡*.｡✱ ─*\n",end: "\n*── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ──*",line: "> ──✱",bullet: "✧.｡✰"},
m14:{start: "*.・。.・゜✭・.・✫・゜・。.*\n",end: "\n*. : ｡✿ﾟ .: ｡✿ﾟ  . : ｡ ✿*",line: "> .・。.・",bullet: "✭・.・✫"},
m15:{start: "*✩⢄⢁✧ --------- ✧⡈⡠✩*\n",end: "\n*✄┈┈┈┈┈┈┈┈┈┈┈┈┈*",line: "> ✩⢄⢁✧---",bullet: "*⢄⢁⡈⡠*"},
m16:{start: "*❀•°•════ஓ๑♡๑ஓ════•°•❀*\n",end: "\n*•.:°❀×═════════×❀°:.•*",line: "> ❀•°•══ஓ",bullet: "๑♡๑"},
m17:{start: "✩.･*:｡≻───── ⋆♡⋆ ─────.•*:｡✩\n",end: "\n*── ･ ｡ﾟ☆: .☽ .:☆ﾟ. ──*",line: "> ✩.･*:｡≻",bullet: "⋆♡⋆"},
m18:{start: "*─────⊹⊱✫⊰⊹─────*\n",end: "\n*≻──── ⋆✩⋆ ────≺*",line: "> ──⊹⊱",bullet: " ⋆✩⋆ "},
m19:{start: "*«──── « ⋅ʚ♡ɞ⋅ » ────»*\n",end: "\n*━━━━♡♥♡━━━━*",line: "> «───",bullet: "⋅ʚ♡ɞ⋅"},
m20:{start: "*⋅•⋅⊰∙∘☽༓☾∘∙⊱⋅•⋅⋅•⋅⊰∙∘☽༓☾∘∙⊱⋅•⋅*\n",end: "\n*∘₊✧────✧₊∘∘₊✧────✧₊∘*",line: "> ⋅•⋅⊰∙∘☽༓☾",bullet: "₊∘∘₊"},
m21:{start: "*꒷︶꒥꒷‧₊˚૮꒰˵•ᵜ•˵꒱ა‧₊˚꒷︶꒥꒷*\n",end: "\n*:♡.•♬✧⁽⁽ଘ( ˊᵕˋ )ଓ⁾⁾:•∴*",line: "> ꒷︶꒥꒷‧",bullet: "૮꒰˵•ᵜ•˵꒱ა"},
m22:{start: "*ೋ❀ೋ═ ❀ ═ೋ❀ೋ*\n",end: "\n*──ೋღ 🌺 ღೋ──*",line: "> ೋ❀",bullet: "ღೋღ"},
m23:{start: "*꒷︶꒷꒥˚꒷︶꒷꒥꒷‧꒷︶꒷꒥꒷‧*\n",end: "\n*꒷︶꒷꒥˚꒷︶꒷꒥꒷‧꒷︶꒷꒥˚꒷‧*",line: "> ·˚ ༘₊· ͟͟͞͞꒰➳",bullet: "ˏˋ°•*⁀➷"}, 
m24:{start: "*♡⑅˖•. ·͙̩̩͙˚̩̥̩̥̩̩̥͙·̩̩̥͙˚̩̥̩̥̩̩͙‧͙ .•˖⑅♡*\n",end: "\n*♡⑅˖•. ·͙̩̩͙˚̩̥̩̥̩̩̥͙·̩̩̥͙̩̩̥̩̩͙‧͙ .•˖⑅♡*",line: "> ·˚ ༘₊· ͟͟͞͞꒰➳",bullet: "ˏˋ°•*⁀➷"}, 
m25:{start: "*╼━━━━━➢━━━━━━╾*\n",end: "\n*╼━━━━━━➢━━━━━━━━╾*",line: "> ·˚ ༘₊· ͟͟͞͞꒰➳",bullet: "ˏˋ°•*⁀➷"},
m26:{start: "*𖦤ˏ⸉ˋ‿̩͙‿̩̩̽‿̩̩̽‿̩͙‿̩̥̩‿̩̩̽‿̩͙‘⸊ˎ*",end: "*ˏ⸉ˋ‿̩͙‿̩̩̽‿̩͙‿̩̥̩‿̩̩̩̩̽‿̩̥̩‿̩̩̽‿̩͙‘⸊ˎ*",line: "> ·˚ ༘₊· ͟͟͞͞꒰➳",bullet: "ˏˋ°•*⁀➷"}
}

// 🆕 دوال المساعدة
function _rand(arr){return arr[Math.floor(Math.random()*arr.length)]}
function protectPlaceholders(text){
if(!text)return{text:'',placeholders:[]}
const placeholders=[]
let tmp=String(text)
const patterns=[/♡[^♡]+♡/g,/\$\{.*?\}/g,/@\d+/g,/https?:\/\/[^\s]+/g,/[\+\-]?\d+@[a-zA-Z0-9._-]+/g,/\b\d+\b/g]
patterns.forEach((rx)=>{tmp=tmp.replace(rx,(m)=>{const token=`__PROT_${placeholders.length}__`;placeholders.push(m);return token})})
return{text:tmp,placeholders}
}
function restorePlaceholders(text,placeholders){
if(!text)return text
let out=String(text)
placeholders.forEach((p,i)=>{out=out.replace(`__PROT_${i}__`,p)})
return out.replace(/__PROT_\d+__/g,'')
}

// 🆕 دالة الكشف الذكي عن لغة النص
function detectTextLanguage(text) {
if (!text) return 'unknown'
const arabicRegex = /[\u0600-\u06FF]/
const englishRegex = /[A-Za-z]/
let arabicCount = 0
let englishCount = 0
for (let char of text) {
if (arabicRegex.test(char)) arabicCount++
if (englishRegex.test(char)) englishCount++
}
if (arabicCount > englishCount) return 'arabic'
if (englishCount > arabicCount) return 'english'
return 'mixed'
}

// 🆕 نظام تزيين الحروف الذكي
export function applySmartFontStyle(text, fontName) {
if (!text || !fontName) return text
const textLanguage = detectTextLanguage(text)
// إذا النص عربي واستخدمنا أنماط عربية
if (textLanguage === 'arabic' && ARABIC_FONT_STYLES[fontName]) {
const font = ARABIC_FONT_STYLES[fontName]
return text.split('').map(char => font[char] || char).join('')
}
// إذا النص إنجليزي أو مختلط واستخدمنا أنماط إنجليزية
if (FONT_STYLES[fontName]) {
const font = FONT_STYLES[fontName]
return text.split('').map(char => font[char] || char).join('')
}
return text
}

// 🆕 نظام الزخرفة الذكية
export function applySmartDecoration(text, decoStyle, options = {}) {
if (!text) return text
const textLanguage = detectTextLanguage(text)
// اختيار مكتبة الزخرفة المناسبة
let styleLibrary = DECORATION_STYLES
if (textLanguage === 'arabic') {
styleLibrary = ARABIC_DECORATION_STYLES
}
  
const style = styleLibrary[decoStyle] || styleLibrary.no
const lines = String(text).split('\n').map((ln, idx) => {
if (!ln.trim()) return ln
const prefix = style.bullet && idx === 0 ? style.bullet : (style.line || '')
return prefix + ln
}).join('\n')
return style.start + lines + style.end
}

// 🆕 نظام الترجمة والزخرفة الذكي الكامل
export async function smartTranslate(m, text, options = {}) {
if (!global.db.data) global.db.data = {users: {}, chats: {}, settings: {}}
let user = global.db.data.users[m.sender] || {}
let chat = global.db.data.chats[m.chat] || {}
// تحديد لغة الترجمة
let targetLang = options.lang || user.language || getUserLang(m.sender) || 'ar'
if (chat.translationMode && chat.translationLang) {
targetLang = chat.translationLang
}
// 🆕 الكشف عن لغة النص الأصلي
const originalTextLanguage = detectTextLanguage(text)
let finalText = text
const shouldTranslate = targetLang !== 'ar' && originalTextLanguage === 'arabic'
if (shouldTranslate && !options.skipTranslation) {
try {
const {text: protectedText, placeholders} = protectPlaceholders(text)
const res = await translate(protectedText, {to: targetLang})
let translated = res?.text ?? protectedText
finalText = restorePlaceholders(translated, placeholders)
} catch (e) {
console.error('Translation Error:', e)
finalText = text
}
}
// 🆕 التزيين الذكي - يطبق دائماً بغض النظر عن اللغة
const shouldDecorate = options.decorate || (user.autoDecorate && options.decorate !== false)
if (shouldDecorate) {
const decoStyle = user.decorationStyle || chat.decorationStyle || 'no'
finalText = applySmartDecoration(finalText, decoStyle, options)
}
// 🆕 تزيين الحروف الذكي
if (options.fontStyle || user.fontStyle) {
const fontToUse = options.fontStyle || user.fontStyle
finalText = applySmartFontStyle(finalText, fontToUse)
}
return finalText
}

// 🆕 دوال إدارة الإعدادات
export function getUserSettings(jid){
if(!global.db.data.users)global.db.data.users={}
let user=global.db.data.users[jid]||{}
return{language:user.language||getUserLang(jid),decorationStyle:user.decorationStyle||'no',fontStyle:user.fontStyle||null,autoTranslate:user.autoTranslate!==false,autoDecorate:user.autoDecorate!==false}
}

export function updateUserSettings(jid,updates){
if(!global.db.data.users)global.db.data.users={}
let user=global.db.data.users[jid]||{}
global.db.data.users[jid]={...user,...updates}
return global.db.data.users[jid]
}

export function getChatSettings(chatId){
if(!global.db.data.chats)global.db.data.chats={}
let chat=global.db.data.chats[chatId]||{}
return{translationMode:chat.translationMode||false,translationLang:chat.translationLang||'ar',decorationStyle:chat.decorationStyle||'no',allowUserStyles:chat.allowUserStyles!==false}
}

export function updateChatSettings(chatId,updates){
if(!global.db.data.chats)global.db.data.chats={}
let chat=global.db.data.chats[chatId]||{}
global.db.data.chats[chatId]={...chat,...updates}
return global.db.data.chats[chatId]
}

// الدوال الأصلية (محفوظة)
export function detectUserCountry(jid){
let phoneNumber=jid.split('@')[0].replace(/\D/g,'')
for(let length=3;length>=1;length--){
let countryCode=phoneNumber.substring(0,length)
if(countryDatabase[countryCode]){return{...countryDatabase[countryCode],originalCode:countryCode,fullNumber:phoneNumber}}
}
return{code:'unknown',language:'ar',name:'غير معروفة',flag:'🌍',originalCode:null,fullNumber:phoneNumber}
}

export function getUserLang(jid){
if(!global.db.data?.users)global.db.data.users={}
let user=global.db.data.users[jid]||{}
if(user.language)return user.language
let countryInfo=detectUserCountry(jid)
return countryInfo.language
}

export function setUserLang(jid,lang){
if(!global.db.data.users)global.db.data.users={}
let user=global.db.data.users[jid]||{}
user.language=lang
global.db.data.users[jid]=user
return true
}

// 🆕 دالة الترجمة الأساسية المحدثة
export async function translateResponse(m, text, options = {}) {
return smartTranslate(m, text, {...options,decorate: options.decorate !== false,forceTranslate: options.forceTranslate || false})
}

// 🆕 دالة ترجمة الأزرار المطورة
export async function translateButtons(m,buttons){
let lang=getUserLang(m.sender)
if(lang==='ar')return buttons
const translatedButtons=[]
for(let button of buttons){
let translatedButton={...button}
let params={}
try{params=JSON.parse(button.buttonParamsJson||'{}')}catch{params={}}
// ترجمة display_text مع زخرفة بسيطة
if(params.display_text&&typeof params.display_text==='string'){
const orig=params.display_text
if(!/^[\.\!\/\#][a-zA-Z0-9_]+$/.test(orig)){
try{
const{text:protectedText,placeholders}=protectPlaceholders(orig)
const res=await translate(protectedText,{to:lang})
let translated=res?.text??protectedText
translated=restorePlaceholders(translated,placeholders)
// زخرفة بسيطة للأزرار
translated=applySimpleButtonDecoration(translated)
params.display_text=translated
}catch(e){
console.error('Button Display Text Translation Error:',e)
params.display_text=applySimpleButtonDecoration(orig)
}
}else{params.display_text=orig}
}
// ترجمة العنوان مع زخرفة بسيطة
if(params.title&&typeof params.title==='string'){
const origTitle=params.title
if(!/^[\.\!\/\#][a-zA-Z0-9_]+$/.test(origTitle)){
try{
const{text:protectedText,placeholders}=protectPlaceholders(origTitle)
const res=await translate(protectedText,{to:lang})
let translated=res?.text??protectedText
translated=restorePlaceholders(translated,placeholders)
params.title=applySimpleButtonDecoration(translated)
}catch(e){
console.error('Button Title Translation Error:',e)
params.title=applySimpleButtonDecoration(origTitle)
}
}else{
params.title=origTitle
}
}
// ترجمة الأقسام والصفوف
if(params.sections){
for(let section of params.sections){
if(section.title&&typeof section.title==='string'){
try{
const{text:pTxt,placeholders}=protectPlaceholders(section.title)
const res=await translate(pTxt,{to:lang})
section.title=restorePlaceholders(res?.text??pTxt,placeholders)
}catch(e){}
}
if(section.rows){
for(let row of section.rows){
if(row.title&&typeof row.title==='string'){
try{
const{text:pTxt,placeholders}=protectPlaceholders(row.title)
const res=await translate(pTxt,{to:lang})
row.title=restorePlaceholders(res?.text??pTxt,placeholders)
row.title=applySimpleButtonDecoration(row.title)
}catch(e){}
}
if(row.description&&typeof row.description==='string'){
try{
const{text:pTxt,placeholders}=protectPlaceholders(row.description)
const res=await translate(pTxt,{to:lang})
row.description=restorePlaceholders(res?.text??pTxt,placeholders)
}catch(e){}
}
}
}
}
}
translatedButton.buttonParamsJson=JSON.stringify(params)
translatedButtons.push(translatedButton)
}
return translatedButtons
}

// 🆕 دالة الزخرفة البسيطة للأزرار
function applySimpleButtonDecoration(text){
if(!text)return text
const simpleDecorations=[{prefix:'*֎╎',suffix:'*'},{prefix:'»➤ ',suffix:' «'},{prefix:'• ',suffix:' •'},{prefix:'➤ ',suffix:' ◁'},{prefix:'︶꒷꒥˚ ',suffix:'˚꒥꒷︶'}]
const deco=simpleDecorations[Math.floor(Math.random()*simpleDecorations.length)]
return deco.prefix+text+deco.suffix
}

export function getAllSupportedLanguages(){
let languages=new Set()
Object.values(countryDatabase).forEach(country=>languages.add(country.language))
let additionalLangs=['ru','he','bn','ta','te','ml','kn','mr','gu','pa']
additionalLangs.forEach(lang=>languages.add(lang))
return Array.from(languages).sort()
}

export function getLanguageInfo(langCode){
const languageNames={'ar':{name:'العربية',native:'العربية',flag:'🇸🇦'},'en':{name:'الإنجليزية',native:'English',flag:'🇺🇸'},'es':{name:'الإسبانية',native:'Español',flag:'🇪🇸'},'fr':{name:'الفرنسية',native:'Français',flag:'🇫🇷'},'de':{name:'الألمانية',native:'Deutsch',flag:'🇩🇪'},'it':{name:'الإيطالية',native:'Italiano',flag:'🇮🇹'},'pt':{name:'البرتغالية',native:'Português',flag:'🇵🇹'},'ru':{name:'الروسية',native:'Русский',flag:'🇷🇺'},'zh':{name:'الصينية',native:'中文',flag:'🇨🇳'},'ja':{name:'اليابانية',native:'日本語',flag:'🇯🇵'},'ko':{name:'الكورية',native:'한국어',flag:'🇰🇷'},'hi':{name:'الهندية',native:'हिन्दी',flag:'🇮🇳'},'tr':{name:'التركية',native:'Türkçe',flag:'🇹🇷'},'nl':{name:'الهولندية',native:'Nederlands',flag:'🇳🇱'},'sv':{name:'السويدية',native:'Svenska',flag:'🇸🇪'},'pl':{name:'البولندية',native:'Polski',flag:'🇵🇱'},'th':{name:'التايلاندية',native:'ไทย',flag:'🇹🇭'},'vi':{name:'الفيتنامية',native:'Tiếng Việt',flag:'🇻🇳'},'id':{name:'الإندونيسية',native:'Bahasa Indonesia',flag:'🇮🇩'},'ms':{name:'الماليزية',native:'Bahasa Malaysia',flag:'🇲🇾'},'fa':{name:'الفارسية',native:'فارسی',flag:'🇮🇷'},'ur':{name:'الأردية',native:'اردو',flag:'🇵🇰'},'he':{name:'العبرية',native:'עברית',flag:'🇮🇱'},'bn':{name:'البنغالية',native:'বাংলা',flag:'🇧🇩'}}
return languageNames[langCode]||{name:langCode,native:langCode,flag:'🌍'}
}
// ✨ دالة الحصول على معلومات الدولة
export function getUserCountryInfo(jid) {
return detectUserCountry(jid)
}

export{detectTextLanguage, FONT_STYLES,ARABIC_FONT_STYLES, ARABIC_DECORATION_STYLES, DECORATION_STYLES,applySimpleButtonDecoration}