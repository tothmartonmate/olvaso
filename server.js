const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Az index oldal (olvaso.html) kiszolgálása
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'olvaso.html'));
});

// Adatbázis létrehozása
const db = new sqlite3.Database('olvasodb.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS olvaso (
      olvaso_id INTEGER PRIMARY KEY,
      nev TEXT,
      regisztracio_datuma TEXT,
      lakcim TEXT,
      tagsagszam TEXT,
      kolcsonzes_szam INTEGER
    )
  `);
});

// POST kérés: új olvasó hozzáadása
app.post('/olvaso', (req, res) => {
  const { olvaso_id, nev, regisztracio_datuma, lakcim, tagsagszam, kolcsonzes_szam } = req.body;

  // Az SQL utasítást itt helyesen kell idézőjelbe tenni
  const stmt = db.prepare(`
    INSERT INTO olvaso (olvaso_id, nev, regisztracio_datuma, lakcim, tagsagszam, kolcsonzes_szam)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(olvaso_id, nev, regisztracio_datuma, lakcim, tagsagszam, kolcsonzes_szam, (err) => {
    if (err) {
      console.error('Hiba az adat mentésekor:', err);
      res.status(500).send('Adatbázis hiba.');
    } else {
      res.status(200).send('Sikeres mentés.');
    }
  });

  stmt.finalize();
});

// GET kérés: az összes olvasó lekérése
app.get('/olvaso', (req, res) => {
  db.all('SELECT * FROM olvaso', (err, rows) => {
    if (err) {
      res.status(500).send('Adatbázis lekérdezési hiba.');
    } else {
      res.json(rows);
    }
  });
});

// Szerver indítása
app.listen(port, () => {
  console.log(`Szerver fut: http://localhost:${port}`);
});
