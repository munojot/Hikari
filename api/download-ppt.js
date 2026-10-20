// Dedicated Vercel Serverless Function: /api/download-ppt
const path = require('path');
const fs = require('fs');

const PPT_DIR = path.resolve(__dirname, '..', 'カタカナ　PPT');
const KATAKANA_FILE_MAP = {
  1: "1. e-learning ア行 _ラヒム.pptx",
  2: "2. e-learning 「カ行」・ナフィサ.pptx",
  3: "3. e-learning_サ行＿シリン＿final_final_.pptx",
  4: "4. e-learning 「タ行」・ハビブロフ　修正.pptx",
  5: "5. e - learning カタカナ ナ行.pptx",
  6: "6. e-learning_ハ行＿ムニラ＿ 最后.pptx",
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

module.exports = (req, res) => {
  const id = parseInt(req.query.id, 10);
  const filename = KATAKANA_FILE_MAP[id];
  if (!id || !filename) {
    return res.status(404).json({ error: "Taqdimot topilmadi (id 1-17 oralig'ida bo'lishi lozim)." });
  }

  const safeFilePath = path.resolve(PPT_DIR, filename);
  if (!fs.existsSync(safeFilePath)) {
    return res.status(404).json({ error: "Fayl serverda topilmadi." });
  }

  const stat = fs.statSync(safeFilePath);
  if (id === 17 && filename.toLowerCase().endsWith('.jpg')) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return fs.createReadStream(safeFilePath).pipe(res);
  }

  // PPTX fayllarni yuklab olish qat'iy taqiqlangan
  return res.status(403).json({
    success: false,
    error: "Taqdimotlarni yuklab olish taqiqlangan. Barcha materiallar faqat sayt orqali online ko'rish uchun mo'ljallangan."
  });
};
