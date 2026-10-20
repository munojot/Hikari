require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Xavfsizlik: Server ma'lumotini yashirish (X-Powered-By ni olib tashlash)
app.disable('x-powered-by');
app.set('trust proxy', true);

// Xavfsizlik HTTP sarlavhalari (Security Headers)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Middlewarelar: JSON va URL-encoded payload limitlarini 10kb bilan cheklash
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Xavfsizlik: Yashirin fayllar (.env*, .git*, .agent* va h.k.) hamda tizim fayllariga kirishni qat'iy taqiqlash
const FORBIDDEN_FILE_PATTERNS = [
  /^\/\..*/i,                // Nuqta bilan boshlanuvchi yashirin fayl va papkalar (/.env, /.git, /.agent va h.k.)
  /\/\..*/i,                 // URL ichidagi har qanday yashirin fayl/papka
  /\.\./,                    // Path traversal urinishlari (..)
  /package(-lock)?\.json$/i, // package.json, package-lock.json
  /server.*\.js$/i,          // server.js va server kodlari
  /server.*\.py$/i,          // server_with_range.py
  /node_modules/i,           // node_modules kutubxonalari
  /brainstorms/i,            // ichki ishchi hujjatlar
  /\.env/i,                  // .env ning har qanday ko'rinishi
  /\.git/i,                  // .git fayllari
  /\.(md|log|bak|conf)$/i    // markdown, log, zaxira va konfiguratsiya fayllari
];

app.use((req, res, next) => {
  // 1. API so'rovlarini va POST arizalarni xavfsizlik statik tekshiruvidan ozod qilish
  if (req.method === 'POST' || req.path.startsWith('/api') || (req.originalUrl && req.originalUrl.startsWith('/api'))) {
    return next();
  }

  let decodedPath = '';
  try {
    decodedPath = decodeURIComponent(req.path);
  } catch (e) {
    return res.status(400).json({ error: 'Bad Request: Noto\'g\'ri URL formati.' });
  }

  for (const pattern of FORBIDDEN_FILE_PATTERNS) {
    if (pattern.test(decodedPath)) {
      return res.status(403).json({
        error: 'Forbidden: Ushbu manzil yoki tizim fayliga kirish taqiqlangan.'
      });
    }
  }
  next();
});

// Statik fayllar uchun Kesh (Cache-Control) sozlamalari
const staticCacheOptions = {
  dotfiles: 'deny',
  etag: true,
  lastModified: true,
  maxAge: '1d', // 24 soat (86400s)
  setHeaders: (res, filePath) => {
    // Statik resurslar (rasmlar, videolar, audio, shriftlar, svg) uchun uzoq muddatli kesh
    if (/\.(png|jpe?g|gif|svg|ico|webp|mp4|webm|woff2?|ttf|eot)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    } else if (/\.(css|js)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
};

// Ruxsat etilgan statik kataloglar
app.use('/assets', express.static(path.join(__dirname, 'assets'), staticCacheOptions));
app.use('/hiragana_gif', express.static(path.join(__dirname, 'hiragana_gif'), staticCacheOptions));
app.use('/hiragana gif', express.static(path.join(__dirname, 'hiragana_gif'), staticCacheOptions));
app.use('/katakana_slides', express.static(path.join(__dirname, 'katakana_slides'), staticCacheOptions));
app.use('/E-learning', express.static(path.join(__dirname, 'E-learning'), staticCacheOptions));

// Katakana PPT fayllari xaritasi (1-17)
const PPT_DIR = path.resolve(__dirname, 'カタカナ　PPT');
const KATAKANA_FILE_MAP = {
  1: "1. e-learning ア行 _ラヒム.pptx",
  2: "2. e-learning 「カ行」・ナフィサ.pptx",
  3: "3. e-learning_サ行＿シリン＿final_final_.pptx",
  4: "4. e-learning 「タ行」・ハビブロフ　修正.pptx",
  5: "5. e - learning カタカナ ナ行.pptx",
  6: "6. e-learning_ハ行＿ムニラ＿ 最後.pptx",
  7: "7. e-learning マ行__サイヨラ oxirgisi.pptx",
  8: "8. E-LEARNING ヤ　ユ　ヨ (oxirgi).pptx",
  9: "10. e-learning ワ　ヲ　ン  (oxirgisi).pptx",
  10: "11. e - learning カタカナ 長音 (1).pptx",
  11: "12. e-learning 促音　ショヒルザ.pptx",
  12: "13. e-learning　ガ、ザ、ダ行.pptx",
  13: "14. e-learning　バ、パ行. oxirgisi.pptx",
  14: "15. e-learning　チャ  ニャ  ミャ.pptx",
  15: "16. e-learning   ヒャ・ビャ・ピャ・リャ.pptx",
  16: "E-learning キャ、ギャ、シャ、ジャ.pptx",
  17: "カタカナ表　最新.JPG"
};

// 1. Rasmiy PPT API (PPT fayllarni yuklab olish taqiqlangan — faqat online ko'rish)
app.get('/api/download-ppt', (req, res) => {
  const id = parseInt(req.query.id, 10);
  const filename = KATAKANA_FILE_MAP[id];
  if (!id || !filename) {
    return res.status(404).json({ error: "Material topilmadi (id 1 dan 17 gacha bo'lishi lozim)." });
  }

  const safeFilePath = path.resolve(PPT_DIR, filename);
  if (!fs.existsSync(safeFilePath)) {
    return res.status(404).json({ error: "Fayl serverda mavjud emas." });
  }

  // Faqat 17-fayl (Katakana jadvali rasmi) bannerda rasm ko'rinishida ko'rsatiladi
  if (id === 17 && filename.toLowerCase().endsWith('.jpg')) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(safeFilePath);
  }

  // Barcha PPT fayllarni yuklab olish qat'iy taqiqlangan
  return res.status(403).json({
    success: false,
    error: "Taqdimotlarni yuklab olish taqiqlangan. Barcha materiallar faqat sayt orqali online ko'rish uchun mo'ljallangan."
  });
});

// 2. Maxsus middleware: /カタカナ　PPT/ va /katakana_ppt/ so'rovlari (Faqat JPG rasmlar ochiq, PPTX bloklangan)
app.use((req, res, next) => {
  let decodedPath = '';
  try {
    decodedPath = decodeURIComponent(req.path);
  } catch (e) {
    return next();
  }

  if (decodedPath.startsWith('/カタカナ　PPT/') || decodedPath.startsWith('/katakana_ppt/')) {
    const relFile = decodedPath.replace(/^\/(カタカナ　PPT|katakana_ppt)\//, '');
    const safeFilePath = path.resolve(PPT_DIR, relFile);
    if (safeFilePath.startsWith(PPT_DIR) && fs.existsSync(safeFilePath) && fs.statSync(safeFilePath).isFile()) {
      if (safeFilePath.toLowerCase().endsWith('.jpg')) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.sendFile(safeFilePath);
      }
      return res.status(403).json({
        error: "Fayllarni yuklab olish taqiqlangan. Faqat sayt orqali online ko'rish mumkin."
      });
    }
  }
  next();
});

// Maxsus ildiz fayllari (robots.txt, sitemap.xml, favicon)
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/favicon.ico', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'assets', 'favicon.svg'));
});

// In-Memory Rate Limiter (Spamdan himoyalanish)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 daqiqa
const RATE_LIMIT_MAX_REQUESTS = 10;          // 15 daqiqada maksimal 10 ta ariza

// Eski yozuvlarni davriy tozalash (xotirani tejash)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

function leadRateLimiter(req, res, next) {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) || req.ip || req.socket.remoteAddress || '127.0.0.1';
  const ip = typeof rawIp === 'string' ? rawIp.trim() : '127.0.0.1';
  const now = Date.now();

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return next();
  }

  if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.startTime = now;
    return next();
  }

  record.count += 1;
  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    const remainingMs = RATE_LIMIT_WINDOW_MS - (now - record.startTime);
    const retryAfterSec = Math.ceil(remainingMs / 1000);
    res.setHeader('Retry-After', retryAfterSec);
    return res.status(429).json({
      success: false,
      error: `Juda ko'p so'rov yuborildi. Iltimos, ${Math.ceil(retryAfterSec / 60)} daqiqadan so'ng qayta urinib ko'ring.`
    });
  }

  next();
}

// Input sanitization yordamchi funksiyasi
function sanitizeInput(data) {
  if (!data || typeof data !== 'object') return {};

  const cleanString = (val, maxLen) => {
    if (typeof val !== 'string') return '';
    return val
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim()
      .slice(0, maxLen);
  };

  return {
    fullName: cleanString(data.fullName, 100),
    phone: cleanString(data.phone, 30),
    selectedCourse: cleanString(data.selectedCourse, 100),
    currentLevel: cleanString(data.currentLevel, 60),
    notes: cleanString(data.notes, 500)
  };
}

// HTML xavfsizligi (XSS himoyasi)
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// .env faylini har bir arizada dinamik yangilab olish
function getEnvConfig() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const config = {};
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex !== -1) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        config[key] = value;
      }
    });
    return config;
  }
  return process.env;
}

// Telegramga xabar yuborish funksiyasi
async function sendToTelegram(leadData) {
  const envConfig = getEnvConfig();
  const botToken = envConfig.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = envConfig.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId || botToken === 'YOUR_BOT_TOKEN_HERE' || chatId === 'YOUR_CHAT_ID_HERE') {
    return {
      success: true,
      configured: false,
      message: '.env faylida TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID kiritilmagan. Iltimos, .env fayliga haqiqiy bot ma\'lumotlaringizni yozing.'
    };
  }

  const now = new Date();
  const timeFormatted = now.toLocaleString('uz-UZ', { 
    timeZone: 'Asia/Tashkent', 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  });

  const messageText = 
`🌸 <b>YANGI ARIZA — HIKARI GROUP</b> 🌸
━━━━━━━━━━━━━━━━━━━━
👤 <b>F.I.SH:</b> ${escapeHtml(leadData.fullName)}
📞 <b>Telefon:</b> <code>${escapeHtml(leadData.phone)}</code>
📚 <b>Tanlangan kurs:</b> <i>${escapeHtml(leadData.selectedCourse || "Ko'rsatilmagan")}</i>
🎯 <b>Darajasi:</b> ${escapeHtml(leadData.currentLevel || "Ko'rsatilmagan")}
📝 <b>Qo'shimcha izoh:</b> ${escapeHtml(leadData.notes || "Yo'q")}
━━━━━━━━━━━━━━━━━━━━
⏰ <b>Vaqt:</b> ${timeFormatted}`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: messageText,
      parse_mode: 'HTML'
    })
  });

  const data = await response.json();

  if (!data.ok) {
    if (data.description && data.description.includes('chat not found')) {
      throw new Error(`Telegram bot sizga xabar yuborishi uchun, avval Telegramda botingizga kirib "Start" (/start) tugmasini bosishingiz kerak!`);
    }
    throw new Error(`Telegram API xatosi: ${data.description || 'Noma\'lum xatolik'}`);
  }

  return { 
    success: true, 
    configured: true, 
    message: 'Ariza Telegram botga muvaffaqiyatli yuborildi!' 
  };
}

// POST API: /api/send-lead (Rate limiting va Input validation bilan)
app.post('/api/send-lead', leadRateLimiter, async (req, res) => {
  try {
    const sanitized = sanitizeInput(req.body);
    const { fullName, phone, selectedCourse, currentLevel, notes } = sanitized;

    // Ism validatsiyasi
    if (!fullName || fullName.length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: "Iltimos, haqiqiy to'liq ismingizni kiriting (kamida 2 ta belgi)." 
      });
    }

    // Telefon raqami validatsiyasi
    const phoneDigits = phone.replace(/\D/g, '');
    const phoneRegex = /^\+?[\d\s\-()]{7,30}$/;
    if (!phone || !phoneRegex.test(phone) || phoneDigits.length < 7) {
      return res.status(400).json({ 
        success: false, 
        error: "Iltimos, to'g'ri telefon raqami kiriting (masalan: +998 90 123 45 67)." 
      });
    }

    const result = await sendToTelegram({
      fullName,
      phone,
      selectedCourse,
      currentLevel,
      notes
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('[EXPRESS API XATOSI]:', err.message);
    return res.status(500).json({ 
      success: false, 
      error: err.message || 'Serverda ichki xatolik yuz berdi.' 
    });
  }
});

// Health check endpoint (monitoring va server tekshiruvi uchun)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(), 
    timestamp: new Date().toISOString() 
  });
});

// Barcha boshqa yo'nalishlar uchun index.html (SPA entry)
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global xatoliklar middleware (Payload too large, Bad JSON format)
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: "Yuborilgan so'rov hajmi juda katta (maksimal 10KB ruxsat etilgan)."
    });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: "Noto'g'ri JSON ma'lumot formati."
    });
  }
  console.error('[UNCAUGHT SERVER ERROR]:', err);
  return res.status(500).json({
    success: false,
    error: 'Serverda ichki xatolik yuz berdi.'
  });
});

// Serverni ishga tushirish (Vercel Serverless va lokal rejimga moslashtirilgan)
if (!process.env.VERCEL) {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`=================================================`);
    console.log(`🚀 Express.js Server faollashdi (Hikari Group)!`);
    console.log(`🌐 Sayt manzili: http://localhost:${PORT}`);
    console.log(`📡 API marshruti: POST http://localhost:${PORT}/api/send-lead`);
    console.log(`🛡️  Xavfsizlik: Rate-limiting, Security Headers, Input Sanitization faol`);
    console.log(`⚡ Kesh: Statik resurslar uchun Cache-Control faol`);
    console.log(`⚙️  Sozlamalar: .env faylidan o'qilmoqda`);
    console.log(`=================================================`);
  });
}

// Vercel Serverless Function uchun eksport
module.exports = app;
