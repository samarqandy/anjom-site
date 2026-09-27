# anjom.uz

ANJOM ijara tizimining sayti. Asosiy til o‘zbekcha (`/`), ruscha versiya `/ru` manzilida.

- **Texnologiya:** [Astro](https://astro.build) va Tailwind CSS. Sahifalar oldindan tayyor HTML bo‘lib chiqadi, shuning uchun tez ochiladi va qidiruv tizimlari yaxshi ko‘radi.
- **Ariza formasi:** kichik Vercel funksiyasi (`api/lead.js`) arizani to‘g‘ridan-to‘g‘ri Telegram chatingizga yuboradi.
- **Hosting:** Vercel, domen `anjom.uz`.

## Tez-tez o‘zgartiriladigan joylar

| Nima | Qayerda |
|---|---|
| Barcha matnlar (o‘zbekcha) | `src/i18n/uz.ts` |
| Barcha matnlar (ruscha) | `src/i18n/ru.ts` — tuzilishi o‘zbekcha fayl bilan bir xil bo‘lishi shart, TypeScript buni tekshiradi |
| Telegram, telefon, email, «Kirish» tugmasi | `src/config.ts` |
| Mahsulot skrinshotlari | `src/assets/screens/` |
| Telegram’da ulashilganda chiqadigan rasm | `public/og-uz.png`, `public/og-ru.png` (1200×630) |

`src/config.ts` dagi bo‘sh qiymatlar saytda ko‘rsatilmaydi. Masalan, `telegram` bo‘sh bo‘lsa, Telegram tugmasi chiqmaydi. Qiymatni to‘ldirib, `main` ga yuborsangiz, sayt o‘zi yangilanadi.

## Ariza formasi

Forma arizani Telegram chatga yuboradi. Buning uchun Vercel → Project → **Settings → Environment Variables** bo‘limida ikkita qiymat kiritiladi:

| O‘zgaruvchi | Qiymat |
|---|---|
| `LEAD_TELEGRAM_BOT_TOKEN` | @BotFather’dan olingan bot tokeni (alohida bot yoki mavjud botingiz) |
| `LEAD_TELEGRAM_CHAT_ID` | Arizalar keladigan chat yoki guruh ID raqami |

Chat ID ni aniqlash:

1. Botni guruhga qo‘shing.
2. Guruhga istalgan xabar yozing.
3. Brauzerda `https://api.telegram.org/bot<TOKEN>/getUpdates` manzilini oching va `"chat":{"id": ...}` qiymatini ko‘chirib oling. Guruhlar uchun bu manfiy son bo‘ladi, masalan `-1001234567890`.

O‘zgaruvchilarni kiritgandan keyin **Redeploy** qiling. Ular kiritilmaguncha forma «yuborib bo‘lmadi» deb javob beradi: ariza hech qayerda saqlanmaydi, shuning uchun forma uni qabul qilgandek ko‘rsatmaydi.

Spamdan himoya: yashirin maydon va juda tez yuborilgan formalar tekshiriladi. Botlarga ham odamlarga beriladigan javob qaytadi, lekin ularning arizasi yuborilmaydi.

## Ishga tushirish

Node.js 22.12 yoki undan yangi versiya kerak.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ papkasiga tayyor sayt
npm run check    # TypeScript va Astro tekshiruvi
npm test         # ariza funksiyasining testlari
```

## Deploy

Repo Vercel loyihasiga ulangan:

- `main` ga push qilinsa, sayt avtomatik yangilanadi;
- har bir PR uchun alohida ko‘rib chiqish (preview) manzili yaratiladi.

## Domen: anjom.uz (ahost.uz)

Domen ahost.uz’da ro‘yxatdan o‘tgan, sayt esa Vercel’da ishlaydi. ahost.uz panelida **DNS** bo‘limiga kiring va quyidagi yozuvlarni qo‘ying:

| Turi | Nomi | Qiymati |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

`@` uchun eski `A` yozuvni o‘chiring, hozir u ahost.uz serveriga qaraydi. DNS yangilanishi bir necha daqiqadan 24 soatgacha davom etadi. Shundan keyin Vercel HTTPS sertifikatini o‘zi chiqaradi va `www.anjom.uz` avtomatik `anjom.uz` ga yo‘naltiriladi.

> **Muhim.** ANJOM tizimining o‘zi (admin panel, API, Telegram Mini App) serverga `anjom.uz` domeni bilan o‘rnatishga mo‘ljallangan edi (`deploy/vps/install.sh anjom.uz`). Asosiy domen saytga berilgani uchun tizimni **`app.anjom.uz`** kabi subdomenga o‘rnating:
>
> 1. ahost.uz’da `A app → server IP` yozuvini qo‘shing.
> 2. Serverda `sudo bash deploy/vps/install.sh app.anjom.uz` ni ishga tushiring.
> 3. `src/config.ts` dagi `appUrl` ga `https://app.anjom.uz` ni yozing.

## Skrinshotlar

Saytdagi skrinshotlar ANJOM’ning demo kompaniyasidan (`scripts/seed.py`) har ikki tilda olingan. Ularni yangilash uchun ANJOM’ni demo ma’lumot bilan ishga tushiring, ekranlarni 2x o‘lchamda suratga oling va `src/assets/screens/` dagi fayllarni almashtiring. Fayl nomlari o‘zgarmasa, kodni o‘zgartirish shart emas.
