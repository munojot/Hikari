# Hikari Group (Yapon Tili Ta'limi): Brainstorm & Texnik Talablar
Sana: 2026-10-13 · Maqsad: "Hikari group" yapon tili ta'lim xizmatlarini taqdim etuvchi, mahsulotlar/kurslar katalogi, talabalar fikrlari va ariza topshirish anketasini o'z ichiga olgan bitta sahifali (one-page) zamonaviy veb-sayt loyihalash.
Fayl: `brainstorms/2026-10-13-landing-page.md`

## 1. Xulosa va Asosiy Qarorlar (Summary & Decisions)
- **Loyiha nomi**: "Hikari group" (光 — Nur, Ziyo) Yapon tili landing sahifasi
- **Faoliyat sohasi**: Yapon tili ta'limi (JLPT 5 ta darajasi: N5, N4, N3, N2, N1)
- **Sayt turi**: Bitta sahifalik (Single Page Landing Page)
- **Vizual uslub va ranglar palitrasi**:
  - Yaponcha an'anaviy va zamonaviy estetika: och pastel ranglar, nozik vasi qog'oz teksturasi (`#FFFDFB`), mayin tonggi shafaq pushti (`#FFF5F6`, `#FFE4E9`) va chuqur to'q ko'k urg'ular (`#0B132B`).
  - **Fuji tog'i (富士山) peyzaji**: Tonggi quyosh (旭日), oppoq qorli cho'qqi, nozik binafsha/lavanda tumanlari va ukiyo-e uslubidagi yapon bulutlari (雲).
  - **Sakura gullari (桜)**: Yuqori burchaklarda gullagan sakura shoxlari va butun sahifa bo'ylab sekin suzib tushuvchi animatsiyali sakura barglari (桜吹雪 - Sakura Fubuki).
  - **Madaniy elementlar**: Talabalar fikrlarida yaponcha qizil muhr (合格 - Hanko/Inkan) va kalligrafiya naqshlari.
- **Sahifa tuzilmasi (Bloklar ketma-ketligi)**:
  1. **Header / Navbar**: Hikari logotipi (光 belgisi bilan), bo'limlar navigatsiyasi, "Bog'lanish" CTA tugmasi, mobil gamburger menyu.
  2. **Hero & Kompaniya haqida**:
     - Hikari Group missiyasi, noldan N1 gacha tizimli o'qitish metodikasi.
     - Asosiy statistika: 5 ta daraja, test tizimi, e-learning platforma imkoniyatlari.
  3. **Mahsulotlar / Kurslar katalogi (~10 xil mahsulot turi)**:
     - Darajalar bo'yicha interaktiv filtrlar (`Barchasi`, `N5`, `N4`, `N3`, `N2`, `N1`).
     - Kurs kartalari: Grammatika e-learning, Darajaviy testlar, Kanji kontenti va testlari, Suhbat (Kaiwa) klublari.
     - **Katakana PPT e-learning to'plami**: N5 moduli ichiga «Web Sayt» papkasidagi 16 ta bosqichli PPTX darsliklar va to'liq Katakana jadvali (JPG) integratsiya qilindi (ochiluvchi drawer va qidiruvli interaktiv modal).
     - Kartada "Tanlash" tugmasi: bosilganda pastdagi anketaga silliq o'tib, tanlangan kurs nomini anketaga avtomatik kiritadi.
  4. **Natijalar va mijozlar fikrlari (Feedback)**:
     - 5★ yulduzli baholash bilan toza kartalar gridi.
     - Talaba ismi, erishgan JLPT sertifikati va samimiy fikrlari.
  5. **Murojaat va ro'yxatdan o'tish anketasi (Lead Form)**:
     - Maydonlar: Ism-familiya, Telefon raqam, Qiziqqan kurs (avto-tanlanadigan), Qo'shimcha savol/izoh.
     - Integratsiya: Email pochta yoki Google Sheets / Webhook orqali arizalarni qabul qilishga tayyor struktura.
  6. **Footer**:
     - Aloqa ma'lumotlari (telefon, manzil, email), ijtimoiy tarmoqlar (Telegram, Instagram, YouTube), mualliflik huquqi.
- **Texnologik stek**:
  - **HTML5 + Tailwind CSS + Vanilla JavaScript**: Ortiqcha dependency va murakkab o'rnatishlarsiz to'g'ridan-to'g'ri ishlaydigan, 100% tezkor va toza arxitektura.

## 2. Savol-Javoblar Qaydnomasi (Q&A Log)
### Q1 — Kompaniya va mahsulotlar yo'nalishi
- **Berilgan savol**: Kompaniyangiz nomi va qanday mahsulotlar/xizmatlar taqdim etilishi haqida.
- **Qabul qilingan qaror**: Kompaniya nomi "Hikari group". Yapon tilini 5 ta darajaga (N5-N1) asoslanib o'rgatadi. Mahsulotlar tarkibida suhbat kurslari, e-learning grammatika kontenti, bilimni sinash testlari, kanji o'rganish kontenti va testlari mavjud.
- **Belgilar (Flags)**: Hal qilindi.

### Q2 — Mahsulotlar katalogi taqdimoti va UX harakati
- **Berilgan savol**: Mahsulotlar (kurslar, e-learning va testlar) bo'limi foydalanuvchiga qanday ko'rinishda taqdim etilsin?
- **Qabul qilingan qaror**: Darajalar (N5–N1) bo'yicha filtr/tablarga ega bo'ladi. Kartadagi "Tanlash" tugmasi bosilganda pastdagi anketada shu kurs avtomatik tanlanadi va anketaga silliq yo'naltiriladi.
- **Belgilar (Flags)**: Hal qilindi.

### Q3 — Murojaat anketasi yuborilish manzili va integratsiya
- **Berilgan savol**: Murojaat anketasi to'ldirilganda arizalar qayerga yuborilishi kerak?
- **Qabul qilingan qaror**: Email pochta yoki Google Sheets jadvaliga avtomatik yoziladi.
- **Belgilar (Flags)**: Hal qilindi.

### Q4 — Vizual dizayn va ranglar uyg'unligi
- **Berilgan savol**: Saytning vizual dizayn uslubi va ranglar uyg'unligi qanday bo'lsin?
- **Qabul qilingan qaror**: Yaponcha zamonaviy estetika: toza oq va to'q ko'k fon, nozik qizil/sakura urg'ulari bilan, yapon madaniyati ruhidagi minimalist ko'rinish.
- **Belgilar (Flags)**: Hal qilindi.

### Q5 — Mijozlar fikrlari bloki ko'rinishi
- **Berilgan savol**: Mijozlar (talabalar) fikrlari bo'limi qanday ko'rinishda taqdim etilsin?
- **Qabul qilingan qaror**: Yulduzchali baholash (5★), talaba fikri va natijalari jamlangan toza kartalar (grid) to'plami.
- **Belgilar (Flags)**: Hal qilindi.

### Q6 — Texnologiyalar steki
- **Berilgan savol**: Saytni qaysi texnologiyalar steki asosida yaratish ma'qul?
- **Qabul qilingan qaror**: Foydalanuvchi tavsiya qilingan variantni ma'qulladi — **HTML5 + Tailwind CSS + Vanilla JS** (engil, qulay, tez ochiluvchi va mustaqil yagona faylli/tizimli tuzilma).
- **Belgilar (Flags)**: Hal qilindi.

## 3. Ochiq Masalalar (Open Flags)
- [x] Barcha asosiy talablar, dizayn yo'nalishi va arxitektura to'liq aniqlandi va kelishildi.
- [ ] Sayt kodini (HTML, CSS, JS) yaratish va to'liq interaktiv holda tayyorlash.
