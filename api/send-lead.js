// Dedicated Vercel Serverless Function: /api/send-lead
const fs = require('fs');
const path = require('path');

function getBotCredentials() {
  let token = process.env.TELEGRAM_BOT_TOKEN;
  let chat = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chat) {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const k = trimmed.slice(0, eqIdx).trim();
          const v = trimmed.slice(eqIdx + 1).trim();
          if (k === 'TELEGRAM_BOT_TOKEN' && !token) token = v;
          if (k === 'TELEGRAM_CHAT_ID' && !chat) chat = v;
        }
      });
    }
  }

  return { token, chat };
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = async (req, res) => {
  // CORS sarlavhalari
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Faqat POST so\'rovi qabul qilinadi.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const fullName = (body.fullName || '').trim();
    const phone = (body.phone || '').trim();
    const selectedCourse = (body.selectedCourse || '').trim();
    const currentLevel = (body.currentLevel || '').trim();
    const notes = (body.notes || '').trim();

    if (!fullName || fullName.length < 2) {
      return res.status(400).json({ success: false, error: 'Iltimos, haqiqiy to\'liq ismingizni kiriting.' });
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone || phoneDigits.length < 7) {
      return res.status(400).json({ success: false, error: 'Iltimos, to\'g\'ri telefon raqami kiriting.' });
    }

    const { token, chat } = getBotCredentials();
    if (!token || !chat || token === 'YOUR_BOT_TOKEN_HERE') {
      return res.status(200).json({
        success: true,
        configured: false,
        message: 'Vercel Environment Variables sozlamalarida TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID kiritilmagan.'
      });
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
👤 <b>F.I.SH:</b> ${escapeHtml(fullName)}
📞 <b>Telefon:</b> <code>${escapeHtml(phone)}</code>
📚 <b>Tanlangan kurs:</b> <i>${escapeHtml(selectedCourse || "Ko'rsatilmagan")}</i>
🎯 <b>Darajasi:</b> ${escapeHtml(currentLevel || "Ko'rsatilmagan")}
📝 <b>Qo'shimcha izoh:</b> ${escapeHtml(notes || "Yo'q")}
━━━━━━━━━━━━━━━━━━━━
⏰ <b>Vaqt:</b> ${timeFormatted}`;

    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const tgRes = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat,
        text: messageText,
        parse_mode: 'HTML'
      })
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) {
      return res.status(500).json({
        success: false,
        error: `Telegram bot xatosi: ${tgData.description || 'Noma\'lum xatolik'}`
      });
    }

    return res.status(200).json({
      success: true,
      configured: true,
      message: 'Ariza Telegram botga muvaffaqiyatli yetkazildi!'
    });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Arizani yuborishda xatolik yuz berdi: ' + (err.message || 'Noma\'lum xatolik')
    });
  }
};
