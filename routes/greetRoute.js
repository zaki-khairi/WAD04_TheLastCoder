const express = require('express');
const router = express.Router();

// GET /greet
router.get('/', (req, res) => {
  res.send(`
    <main style="font-family:system-ui; padding:24px; max-width:720px; margin:auto">
      <h1 style="text-decoration: underline">Greet</h1>

      <p>Hi👋, Terima Kasih sudah berkunjung ke web kami</p>
      <p>kamu bisa pake parameter query atau path untuk menyapa.</p>
      <h3>Contoh</h3>
      <p>/greet/zaki</p>
      <p style="margin-top:24px"><a href="/">← Kembali ke Home</a></p>
    </main>
  `);
});

// GET /greet/:name  → menyapa via path param
router.get('/:name', (req, res) => {
  const { name } = req.params;
  res.send(`
    <main style="font-family:system-ui; padding:24px; max-width:720px; margin:auto">
      <h1>Halo, ${escapeHtml(name)}! 👋</h1>
      <p>Senang bertemu denganmu.</p>
      <p style="margin-top:24px"><a href="/greet">← Kembali ke Greet</a></p>
    </main>
  `);
});

module.exports = router;
