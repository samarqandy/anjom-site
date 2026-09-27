/**
 * Every word on the Uzbek page. The Russian file must have exactly the same
 * shape — TypeScript checks it — so a section added here cannot be forgotten
 * there.
 *
 * Uzbek Latin: o‘ and g‘ are written with ‘ (U+2018), the tutuq belgisi with
 * ’ (U+2019), as in «ma’lumot».
 */

export type Mark = 'yes' | 'partial' | 'no'

export const uz = {
  lang: 'uz' as 'uz' | 'ru',
  htmlLang: 'uz-Latn',
  ogLocale: 'uz_UZ',
  path: '/',

  meta: {
    title: 'ANJOM — ijara biznesi uchun tizim: shaxmatka, Telegram vitrina, onlayn to‘lov',
    description:
      'O‘zbekistondagi ijara xizmatlari uchun tizim: bandlov shaxmatkasi, mijozlar uchun Telegram vitrina, Payme va Click orqali to‘lov, garov, hujjatlar va hisobotlar.',
    ogAlt: 'ANJOM — ijara biznesi uchun tizim',
  },

  nav: {
    features: 'Imkoniyatlar',
    telegram: 'Telegram',
    money: 'To‘lov va garov',
    faq: 'Savollar',
    cta: 'Ariza qoldirish',
    login: 'Kirish',
    menu: 'Menyu',
    switchLabel: 'Русская версия',
    switchShort: 'RU',
    switchHref: '/ru',
  },

  hero: {
    eyebrow: 'Ijara xizmatlari uchun tizim',
    title: 'Ijara biznesini daftar va Excel’siz boshqaring',
    lead: 'Bandlov shaxmatkasi, mijozlar uchun Telegram vitrina, Payme va Click orqali to‘lov, garov va hujjatlar — O‘zbekistondagi ijara xizmatlari uchun bitta tizimda.',
    primary: 'Ariza qoldirish',
    secondary: 'Imkoniyatlarni ko‘rish',
    chips: ['O‘zbek va rus tilida', 'Payme va Click', 'Telegram Mini App', 'Kompyuter va telefonda'],
    boardAlt:
      'ANJOM paneli: ijara shaxmatkasi — har bir buyum bo‘yicha kunlar kesimida bandlovlar',
    phoneAlt: 'Telegram Mini App: mahsulot kartasi va bo‘sh kunlar kalendari',
  },

  problems: {
    eyebrow: 'Tanish holatmi?',
    title: 'Ijarada vaqt va pul qayerda yo‘qoladi',
    items: [
      {
        icon: 'CalendarX2',
        title: 'Bir buyum — ikki mijozga',
        text: 'Daftarda bandlov ko‘rinmay qoldi — to‘y kuni stullar yetmay qoladi.',
      },
      {
        icon: 'MessagesSquare',
        title: 'Bitmas qo‘ng‘iroqlar',
        text: 'Instagram va telefonda har kuni o‘sha savollar: «bo‘shmi?», «qancha?», «qachon olib kelasiz?»',
      },
      {
        icon: 'IdCard',
        title: 'Pasport garovda',
        text: 'Pasportni garovga olish qonunga zid, naqd garovning hisobi esa chalkashib ketadi.',
      },
      {
        icon: 'Hourglass',
        title: 'Kechikish va qarzlar',
        text: 'Kim qaytarmagani, kim to‘lamagani esdan chiqadi — pul qaytmay qoladi.',
      },
      {
        icon: 'Calculator',
        title: 'Kassa mos kelmaydi',
        text: 'Kun oxirida naqd, karta va o‘tkazmalarni yig‘ish soatlab vaqt oladi.',
      },
      {
        icon: 'PackageSearch',
        title: 'Qaysi buyum foyda keltiradi?',
        text: 'Nima tez-tez olinadi, nima omborda chang bosib yotibdi — aniq raqam yo‘q.',
      },
    ],
    closing:
      'ANJOM bularning hammasini bitta tizimga yig‘adi: xodimlar uchun panel, mijozlar uchun Telegram.',
    closingCta: 'Qanday ishlaydi',
  },

  features: {
    eyebrow: 'Imkoniyatlar',
    title: 'Ijaraning hamma jarayoni — bir joyda',
    lead: 'Arizadan tortib qaytarish va hisob-kitobgacha.',
    items: [
      {
        icon: 'CalendarRange',
        title: 'Bandlov shaxmatkasi',
        text: 'Har bir buyum bo‘yicha kim, qachon va nechta olgani kunlar kesimida. Bir buyumni ikki marta band qilib bo‘lmaydi.',
      },
      {
        icon: 'Send',
        title: 'Telegram vitrina',
        text: 'Mijoz sizning botingizda katalogni ko‘radi, sanani tanlaydi, band qiladi va to‘laydi.',
      },
      {
        icon: 'CreditCard',
        title: 'Onlayn to‘lov',
        text: 'Payme va Click orqali Telegram’da to‘lov. Pul buyurtmaga o‘zi tushadi.',
      },
      {
        icon: 'Wallet',
        title: 'Garov hisobi',
        text: 'Garov alohida hisoblanadi: shikast yoki kechikish uchun ushlab qolasiz, qolganini qaytarasiz.',
      },
      {
        icon: 'QrCode',
        title: 'QR bilan berish va qabul qilish',
        text: 'Har bir buyumga QR yorliq. Skanerlab berasiz, foto bilan qabul qilasiz, qisman qaytarish ham hisobda.',
      },
      {
        icon: 'FileText',
        title: 'Shartnoma va dalolatnoma',
        text: 'O‘zbek va rus tilida PDF hujjatlar — buyurtma ma’lumotlari bilan, bir tugmada.',
      },
      {
        icon: 'Truck',
        title: 'Yetkazib berish',
        text: 'Reyslar, haydovchilar va manzillar: kim, qachon, nimani olib borishi aniq.',
      },
      {
        icon: 'UserCheck',
        title: 'Mijozlar va ishonch',
        text: 'Har bir mijozning tarixi va ishonchlilik reytingi. Qora ro‘yxat va ijara xizmatlari o‘rtasida ishonch tarmog‘i.',
      },
      {
        icon: 'ChartColumn',
        title: 'Hisobotlar',
        text: 'Tushum, bandlik, har bir buyumning daromadi va qarzlar. Excel’ga bir tugmada.',
      },
      {
        icon: 'KeyRound',
        title: 'Xodimlar va huquqlar',
        text: 'Egasi, menejer, omborchi, haydovchi — har kimga o‘z huquqi. Har bir harakat jurnalga yoziladi.',
      },
      {
        icon: 'Wrench',
        title: 'Ombor va ta’mir',
        text: 'Ta’mirdagi buyumlar band qilinmaydi. Bir nechta ombor va ular orasida ko‘chirish.',
      },
      {
        icon: 'BellRing',
        title: 'Eslatmalar',
        text: 'Qaytarish vaqti, kechikish va qarz haqida mijozga Telegram’da o‘z tilida xabar.',
      },
    ],
  },

  board: {
    eyebrow: 'Shaxmatka',
    title: 'Nima bo‘sh, nima band — bir qarashda',
    text: 'Har bir buyum va har bir kun bitta jadvalda. Yangi buyurtmada tizim bo‘sh qoldiqni o‘zi tekshiradi — bir buyumni ikki mijozga va’da qilib qo‘yish imkonsiz.',
    bullets: [
      'Donali (seriya raqamli) va miqdoriy buyumlar, tayyor komplektlar',
      'Qaytarilmagan buyumlar keyingi bandlovlarni o‘zi to‘sadi',
      'Ta’mirdagi va shikastlangan birliklar hisobga olinadi',
      'Bir nechta ombor; ikki hafta, oy yoki ikki oylik ko‘rinish',
    ],
    alt: 'Shaxmatka: qatorlarda buyumlar, ustunlarda kunlar, rangli chiziqlar — bandlovlar va kechikkan buyurtma',
  },

  telegram: {
    eyebrow: 'Telegram vitrina',
    title: 'Mijozlaringiz Telegram’dan chiqmaydi',
    text: 'O‘zbekistonda deyarli hamma Telegram’da. ANJOM sizning botingizga do‘kon qo‘shadi: mijoz katalogni ko‘radi, bo‘sh kunlarni tanlaydi va band qiladi — sizga qo‘ng‘iroq qilmasdan.',
    bullets: [
      'Katalog, narxlar va bo‘sh kunlar kalendari',
      'Band qilish, to‘lash va muddatni uzaytirish — mijozning o‘zi',
      'Ijara shartlarini ilovada o‘qib, qabul qiladi',
      'Buyurtma holati haqida xabarlar o‘zbek yoki rus tilida',
    ],
    frameClose: 'Yopish',
    frameSubtitle: 'mini app',
    shots: [
      {
        key: 'product',
        caption: 'Bo‘sh kunlar kalendari',
        alt: 'Mahsulot kartasi: tariflar va kunlar bo‘yicha bo‘sh qoldiq',
      },
      {
        key: 'orders',
        caption: 'To‘lash va uzaytirish',
        alt: 'Mijoz buyurtmalari: ijarani va garovni to‘lash, shartlarni qabul qilish, uzaytirish',
      },
      {
        key: 'extend',
        caption: 'Uzaytirish narxi oldindan',
        alt: 'Uzaytirish oynasi: yangi sana, bo‘shligi va qo‘shimcha to‘lov summasi',
      },
      {
        key: 'terms',
        caption: 'Shartlarni qabul qilish',
        alt: 'Ijara shartlari matni va «Shartlarni qabul qilaman» tugmasi',
      },
    ],
  },

  money: {
    eyebrow: 'To‘lov va garov',
    title: 'Har bir so‘m hisobda',
    text: 'To‘lovlar, garovlar va qarzlar har bir buyurtmada ko‘rinib turadi. Kassa kun yakunida o‘zi yig‘iladi.',
    bullets: [
      'Payme va Click orqali Telegram’da to‘lov — pul buyurtmaga o‘zi tushadi',
      'Garov alohida: shikast va kechikishni ushlab, qolganini qaytarasiz',
      'Kechikish jarimasi tarif bo‘yicha o‘zi hisoblanadi',
      'Qarz eslatmasi mijozga bir tugma bilan',
      'Kassa: naqd, karta, o‘tkazma — kunlik yakun',
    ],
    note: {
      title: 'Pasport emas — pul garov',
      text: 'Pasportni garovga olish qonunga zid. ANJOM pul garovini to‘liq hisob bilan yuritadi: qancha olindi, nima ushlandi, qancha qaytarildi.',
    },
    alt: 'Buyurtma sahifasi: pozitsiyalar, holat, kechikish, mijoz reytingi, hisob-kitob va to‘lov',
  },

  reports: {
    eyebrow: 'Hisobotlar',
    title: 'Qaysi buyum pul keltiradi, qaysi biri bekor turibdi',
    text: 'Raqamlar taxmin emas: tushum, bandlik va har bir buyumning daromadi bitta sahifada. Nimani ko‘proq sotib olish, nimani sotish yoki reklama qilish kerakligini ko‘rasiz.',
    bullets: [
      'Kunlik tushum va buyurtmalar manbasi',
      'Har bir mahsulotning bandligi foizda',
      'Har bir donali buyumning umumiy daromadi',
      'Top mijozlar va kechikishlar ulushi',
      'CSV eksport — Excel’da ochiladi',
    ],
    alt: 'Hisobotlar: tushum, sotuvlar, yangi mijozlar, kunlik tushum grafigi va buyurtmalar manbasi',
  },

  team: {
    eyebrow: 'Jamoa',
    title: 'Jamoangiz — Telegram guruhida',
    text: 'Yangi arizalar, kechikishlar va to‘lovlar haqida xabar xodimlar guruhiga keladi. Har tong — kun hisoboti: nimani berish, nimani qabul qilish, kim qarzdor.',
    bullets: [
      'Guruh bir martalik kod bilan ulanadi',
      'Rollar: egasi, menejer, omborchi, sotuvchi, haydovchi',
      'Har bir harakat jurnalda: kim, qachon, nimani o‘zgartirdi',
    ],
    chat: {
      title: 'Ombor · xodimlar',
      subtitle: '4 a’zo, ANJOM bot',
      sender: 'ANJOM',
      messages: [
        {
          text: '📊 **27.09 uchun hisobot**\n📤 Bugun berish: 3\n📥 Bugun qaytishi kerak: 2\n⚠️ Muddati o‘tgan: 1\n🆕 Tasdiq kutmoqda: 2\n💵 Kecha kassa: +8 420 000 / −600 000\n💳 Mijozlar qarzi: 7 860 000',
          time: '08:00',
        },
        {
          text: '🆕 **Yangi so‘rov A2609-00017** Telegramdan\n👤 Shuxrat Yusupov\n📅 29.09 — 01.10\n💰 720 000 so‘m\nBandlov 27.09, 21:00 gacha — buyurtmani tasdiqlang.',
          time: '09:12',
        },
        {
          text: '💳 **A2609-00016** buyurtmasi uchun onlayn to‘lov: 1 250 000 so‘m\n👤 Nodira Karimova',
          time: '10:47',
        },
        {
          text: '⚠️ **A2609-00005** buyurtmasi muddati o‘tdi (muddat 27.09, 14:00)\n👤 Dilnoza Rahimova',
          time: '14:05',
        },
      ],
    },
  },

  compare: {
    eyebrow: 'Nega ANJOM',
    title: 'O‘zbekistondagi ijara uchun yaratilgan',
    lead: 'Xorijiy dasturlar kuchli, lekin ular bu yerdagi to‘lov tizimlarini, tilni va mijozlarning Telegram odatlarini bilmaydi.',
    columns: ['ANJOM', 'Xorijiy dasturlar', 'Rossiya CRM’lari', 'Daftar va Excel'],
    rows: [
      {
        label: 'O‘zbek tilida panel, hujjatlar va xabarlar',
        values: ['yes', 'no', 'no', 'partial'] as Mark[],
      },
      { label: 'Payme va Click orqali to‘lov', values: ['yes', 'no', 'no', 'no'] as Mark[] },
      {
        label: 'Mijozlar uchun Telegram vitrina',
        values: ['yes', 'no', 'partial', 'no'] as Mark[],
      },
      {
        label: 'Ikki marta band qilishdan himoya',
        values: ['yes', 'yes', 'yes', 'no'] as Mark[],
      },
      { label: 'Garov va qarzlar hisobi', values: ['yes', 'yes', 'partial', 'no'] as Mark[] },
      {
        label: 'Ijara xizmatlari o‘rtasida ishonch tarmog‘i',
        values: ['yes', 'no', 'no', 'no'] as Mark[],
      },
    ],
    legend: { yes: 'bor', partial: 'qisman', no: 'yo‘q' },
    note: 'Ochiq manbalardagi ma’lumotlar asosida, 2026-yil sentabr holatiga.',
  },

  segments: {
    eyebrow: 'Kimlar uchun',
    title: 'Har qanday anjom ijarasi uchun',
    items: [
      {
        icon: 'Hammer',
        title: 'Qurilish asboblari',
        text: 'Perforator, beton aralashtirgich, iskala, generator',
      },
      {
        icon: 'PartyPopper',
        title: 'To‘y va tadbir jihozlari',
        text: 'Stol-stul, idish-tovoq, qozon, samovar, chodir',
      },
      {
        icon: 'Shirt',
        title: 'Liboslar',
        text: 'To‘y ko‘ylaklari, kostyumlar, milliy liboslar',
      },
      {
        icon: 'Camera',
        title: 'Foto, video va ovoz',
        text: 'Kamera, yorug‘lik, kolonkalar, mikrofonlar',
      },
      { icon: 'Bike', title: 'Sport va sayohat', text: 'Velosiped, palatka, chang‘i, qayiq' },
      {
        icon: 'HeartPulse',
        title: 'Tibbiy jihozlar',
        text: 'Nogironlar aravachasi, funksional karavot',
      },
    ],
  },

  steps: {
    eyebrow: 'Qanday boshlanadi',
    title: 'Uch qadamda ishga tushadi',
    items: [
      {
        title: 'Ariza qoldiring',
        text: 'Bog‘lanib, ANJOM’ni sizning buyumlaringiz misolida ko‘rsatamiz.',
      },
      {
        title: 'Katalog va omborni kiritamiz',
        text: 'Buyumlar, narxlar, garov qoidalari va xodimlarni birga sozlaymiz.',
      },
      {
        title: 'Telegram botni ulaysiz',
        text: '@BotFather’da bot yaratasiz, tokenni kiritasiz — mijozlar band qila boshlaydi.',
      },
    ],
  },

  roadmap: {
    eyebrow: 'Rejada',
    title: 'ANJOM rivojlanishda davom etadi',
    lead: 'Keyingi imkoniyatlar — mijozlarimiz eng ko‘p so‘ragan narsalar.',
    items: [
      {
        icon: 'CreditCard',
        title: 'Garovni kartada ushlab turish',
        text: 'Payme orqali: pul mijoz kartasida band turadi, kerak bo‘lsa ushlanadi.',
      },
      {
        icon: 'MessageSquareText',
        title: 'SMS xabarlar',
        text: 'Telegram’i yo‘q mijozlarga tasdiq va eslatmalar.',
      },
      {
        icon: 'Receipt',
        title: 'Onlayn kassa',
        text: 'Har bir to‘lovga fiskal chek avtomatik.',
      },
      {
        icon: 'FileSignature',
        title: 'E-IMZO va Didox',
        text: 'Yuridik shaxslar bilan elektron shartnoma va hisob-faktura.',
      },
      {
        icon: 'Sparkles',
        title: 'AI yordamchi',
        text: 'Mijozlarga botda javob beradi, sizga esa kunlik tavsiyalar beradi.',
      },
    ],
    note: 'Muddatlar va tartib mijozlarimiz talabiga qarab o‘zgarishi mumkin.',
  },

  faq: {
    eyebrow: 'Savollar',
    title: 'Ko‘p beriladigan savollar',
    items: [
      {
        q: 'Dasturni o‘rnatish kerakmi?',
        a: 'Yo‘q. ANJOM brauzerda ishlaydi — kompyuterda ham, telefonda ham. Mijozlaringiz uchun esa Telegram yetarli.',
      },
      {
        q: 'Telegram bot qanday ulanadi?',
        a: '@BotFather’da bot yaratib, uning tokenini ANJOM sozlamalariga kiritasiz. Shundan so‘ng botingizda katalog, band qilish va to‘lov ishlay boshlaydi.',
      },
      {
        q: 'Qaysi to‘lov usullari bor?',
        a: 'Telegram orqali — Payme va Click. Kassada naqd, karta va bank o‘tkazmasi qayd etiladi, kun oxirida kassa yakuni chiqadi.',
      },
      {
        q: 'Garov qanday hisoblanadi?',
        a: 'Har bir mahsulot uchun garov qoidasi belgilanadi. Qaytarishda shikast yoki kechikish uchun summa ushlanadi, qolgani qaytariladi — hammasi buyurtmada va kassada ko‘rinadi.',
      },
      {
        q: 'Ma’lumotlarim xavfsizmi?',
        a: 'Har bir kompaniyaning ma’lumotlari ma’lumotlar bazasi darajasida ajratilgan — boshqa kompaniya ularni ko‘ra olmaydi. Xodimlar faqat o‘z huquqi doirasida ishlaydi, har bir harakat jurnalga yoziladi.',
      },
      {
        q: 'Rus tilida ishlasa bo‘ladimi?',
        a: 'Ha. Panel, hujjatlar va mijozlarga xabarlar o‘zbek va rus tilida. Har bir xodim va mijoz o‘z tilini tanlaydi.',
      },
      {
        q: 'Narxi qancha?',
        a: 'Narx ijara xizmatingiz hajmiga bog‘liq. Ariza qoldiring — tariflar va ulanish shartlari bilan tanishtiramiz.',
      },
    ],
  },

  contact: {
    eyebrow: 'Aloqa',
    title: 'ANJOM’ni o‘z buyumlaringiz misolida ko‘ring',
    text: 'Ariza qoldiring — bog‘lanib, qisqa ko‘rsatuv o‘tkazamiz va savollaringizga javob beramiz.',
    points: [
      'Sizning katalogingiz misolida ko‘rsatamiz',
      'Ulanish va sozlashda yordam beramiz',
      'O‘zbek yoki rus tilida',
    ],
    contactsTitle: 'Yoki to‘g‘ridan-to‘g‘ri yozing',
    telegramLabel: 'Telegram',
    phoneLabel: 'Telefon',
    emailLabel: 'Email',
    telegramText: 'Assalomu alaykum! ANJOM haqida ma’lumot olmoqchiman.',
    form: {
      name: 'Ismingiz',
      namePlaceholder: 'Masalan, Aziz',
      phone: 'Telefon',
      phonePlaceholder: '90 123 45 67',
      business: 'Ijara turi',
      businessOptions: [
        'Qurilish asboblari',
        'To‘y va tadbir jihozlari',
        'Liboslar',
        'Foto va video',
        'Boshqa',
      ],
      businessPlaceholder: 'Tanlang',
      message: 'Izoh',
      messagePlaceholder: 'Ixtiyoriy: nechta buyum, qaysi shahar…',
      submit: 'Ariza yuborish',
      sending: 'Yuborilmoqda…',
      success: 'Rahmat! Arizangiz qabul qilindi — tez orada bog‘lanamiz.',
      error: 'Yuborib bo‘lmadi. Iltimos, birozdan so‘ng qayta urinib ko‘ring.',
      invalid: 'Ism va telefon raqamini to‘g‘ri kiriting.',
      privacy: 'Ma’lumotlaringiz faqat siz bilan bog‘lanish uchun ishlatiladi.',
    },
  },

  footer: {
    tagline: 'Ijara biznesi uchun tizim.',
    country: 'O‘zbekiston',
    rights: 'Barcha huquqlar himoyalangan.',
  },

  notFound: {
    title: 'Sahifa topilmadi',
    text: 'Bu manzilda sahifa yo‘q. Bosh sahifaga qayting.',
    back: 'Bosh sahifa',
  },
}

export type Content = typeof uz
