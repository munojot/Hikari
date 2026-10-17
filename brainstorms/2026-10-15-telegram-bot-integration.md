# Telegram Bot Integratsiyasi: Brainstorm & Texnik Talablar
Sana: 2026-10-15 · Maqsad: Hikari Group veb-saytidagi ariza topshirish (zakaz berish) formasini Telegram botga ulash va arizalarni avtomatik tarzda Telegram orqali qabul qilish.
Fayl: `brainstorms/2026-10-15-telegram-bot-integration.md`

## 1. Xulosa va Asosiy Qarorlar (Summary & Decisions)
- **Asosiy maqsad**: Foydalanuvchi anketani to'ldirib yuborganda, arizalar real vaqtda Telegram bot orqali adminga yoki guruhga borishi to'liq ta'minlandi.
- **Bot holati**: Foydalanuvchi `.env` fayliga haqiqiy `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` ni kiritdi. Bot nomi `@WebsaytJapanese_bot` ekanligi tasdiqlandi.
- **Server holati**: Node.js + Express server `http://localhost:8080` portida to'liq ish holatida.
- **Muhim Telegram qoidasi**: Telegram xavfsizlik qoidalariga ko'ra, bot shaxsiy chatga xabar yuborishi uchun foydalanuvchi birinchi marta botga kirib **Start** (`/start`) tugmasini bosishi shart.

## 2. Savol-Javoblar Qaydnomasi (Q&A Log)
### Q1 — Bot va Chat ID tayyorgarligi
- **Berilgan savol**: Telegram botingiz (Bot Token) va Chat ID bormi yoki yangi bot ochish kerakmi?
- **Qabul qilingan qaror**: Foydalanuvchida tayyor Bot Token va Chat ID mavjud.
- **Belgilar (Flags)**: Hal qilindi.

### Q2 — Tokenni saqlash usuli (.env fayl)
- **Berilgan savol**: Bot Token va Chat ID ni qanday kiritamiz?
- **Qabul qilingan qaror**: Foydalanuvchi `.env` fayl orqali ulashni tanladi.
- **Belgilar (Flags)**: Hal qilindi.

### Q3 — Backend server va texnologiyalar steki
- **Berilgan savol**: .env faylini o'qish va Telegramga yuborish uchun qaysi server yechimini ma'qul ko'rasiz?
- **Qabul qilingan qaror**: Foydalanuvchi **Node.js + Express** ni tanladi.
- **Belgilar (Flags)**: Hal qilindi.

## 3. Ochiq Masalalar (Open Flags)
- [x] Barcha talablar to'liq aniqlandi va kelishildi.
- [x] `package.json` yaratildi va `express`, `dotenv`, `cors` paketlari o'rnatildi.
- [x] `server.js` Express asosida qayta yozildi va `.env` integratsiyasi ulandi.
- [x] Express server `http://localhost:8080` da ishga tushirildi.
- [x] Foydalanuvchi `.env` fayliga kalitlarni kiritdi va bot ulanishi tasdiqlandi (`@WebsaytJapanese_bot`).
- [x] Foydalanuvchi Telegramda `@WebsaytJapanese_bot` botiga kirdi va `/start` bosildi. Real Telegram arizalari yetib borgani tasdiqlandi.
- [x] **Boost Optimizatsiyalari**:
  - **SEO & SMM**: Google meta-teglar, Open Graph, Twitter Cards, Schema.org JSON-LD (`EducationalOrganization` & `Course`).
  - **Fayllar**: `assets/favicon.svg` (yaponcha 光 va sakura bezakli), `robots.txt`, `sitemap.xml`.
  - **Xavfsizlik**: Express rate limiting (15 daqiqada max 10 ta ariza), 10KB payload limit, xavfsizlik HTTP sarlavhalari (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`), yashirin fayllar himoyasi (`.env`, `.git`).
  - **Tezlik**: Shriftlar uchun `preconnect` / `dns-prefetch`, statik fayllar uchun `Cache-Control` (1 kun).
