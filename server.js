const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik faylların (HTML, CSS, JS) oxunması
app.use(express.static(__dirname));

// ================================
// TELEGRAM BOT AYARLARI
// ================================
const TELEGRAM_BOT_TOKEN = "8803675917:AAEC7Xp5FQ7quv4q7F7O9LatL2vxeVgFjyk";
const TELEGRAM_CHAT_ID = "8769788773";

async function sendTelegramAlert(message) {
    try {
        await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: "HTML"
                })
            }
        );
    } catch (error) {
        console.error("Telegram xətası:", error);
    }
}

// Bazanı oxumaq və yazmaq üçün funksiyalar
const DB_PATH = path.join(__dirname, "db.json");

function readDatabase() {
    if (!fs.existsSync(DB_PATH)) {
        return { stores: [], stocks: [] };
    }
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
}

function writeDatabase(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

// ================================
// SƏHİFƏLƏR
// ================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// ================================
// API: MAĞAZA YARADILDI
// ================================
app.post("/api/create-store", async (req, res) => {
    const { storeName, userName } = req.body;

    // Bazaya əlavə edirik
    const db = readDatabase();
    db.stores.push({ storeName, userName, createdAt: new Date() });
    writeDatabase(db);

    const message = `
🟢 <b>Yeni Mağaza Yaradıldı</b>

🏪 Mağaza adı: ${storeName || "Qeyd olunmayıb"}
👤 İstifadəçi: ${userName || "Qoşqar Hüseynov"}
🆔 ID: 8769788773
`;

    await sendTelegramAlert(message);

    res.json({ success: true, message: "Mağaza yaradıldı və bazaya yazıldı." });
});

// ================================
// API: MƏLUMATLAR SIFIRLANDI
// ================================
app.post("/api/delete-store", async (req, res) => {
    const { storeName, userName } = req.body;

    // Bazadan silirik
    try {
        const db = readDatabase();
        if (db && db.stores) {
            db.stores = db.stores.filter(s => s.storeName !== storeName);
            writeDatabase(db);
        }
    } catch (err) {
        console.error("Baza xətası:", err);
    }

    const message = `
🔴 <b>Məlumatlar Sıfırlandı!</b>

🏪 Mağaza adı: ${storeName || "Qeyd olunmayıb"}
👤 İstifadəçi: ${userName || "Qoşqar Hüseynov"}
🆔 ID: 8769788773
`;

    await sendTelegramAlert(message);

    res.json({ success: true, message: "Məlumatlar sıfırlandı." });
});