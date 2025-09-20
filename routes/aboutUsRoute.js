const express = require('express');
const router = express.Router();

// GET /aboutus
router.get('/', (req, res) => {
  res.send(`
    <main style="font-family:system-ui; padding:24px; max-width:720px; margin:auto">
      <h1 style="text-decoration: underline">About Us</h1>
      <section>
        <h2>Zaki Khairi</h2>
        <p>Saya adalah mahasiswa jurusan data science yang tertarik dengan dunia teknologi</p>
      </section>
      <section>
        <h2>Tim</h2>
        <ul>
          <li>Zaki \u002D Frontend Developer</li>
        </ul>
      </section>
      <p style="margin-top:24px"><a href="/">← Kembali ke Home</a></p>
    </main>
  `);
});

// contoh sub-route: GET /aboutus/contact
router.get('/contact', (req, res) => {
  res.send(`
    <main style="font-family:system-ui; padding:24px; max-width:720px; margin:auto">
      <h1>Kontak</h1>
      <p>Email: hello@example.com</p>
      <p>Telp: +62-812-3456-7890</p>
      <p style="margin-top:24px"><a href="/aboutus">← Kembali ke About Us</a></p>
    </main>
  `);
});

module.exports = router;
