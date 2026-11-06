// ============================================================
// Esthetics Rising — servidor de reservas
// Node.js + Express. DB: Postgres (DATABASE_URL) o SQLite local.
// Env vars:
//   PORT          puerto (default 3000)
//   DATABASE_URL  si existe -> Postgres; si no -> SQLite local
//   STORE_KEY     clave compartida para /store y APIs de gestión.
//   ADMIN_KEY     clave del dueño para /admin (kill switch).
// ============================================================

const express = require("express");
const path = require("path");
const crypto = require("crypto");
const db = require("./db");
const suspend = require("./suspend");

const PORT = process.env.PORT || 3000;
const STORE_KEY = process.env.STORE_KEY || "";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.use(suspend.middleware);
suspend.registerAdmin(app);

// ---------------- Auth de gestión ----------------
if (!STORE_KEY) {
  console.warn("[esthetics] ⚠️  STORE_KEY no configurado — /store abierto (modo desarrollo).");
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

function requireStore(req, res, next) {
  if (!STORE_KEY) return next();
  const k = req.headers["x-store-key"] || req.query.key || "";
  if (k && safeEqual(k, STORE_KEY)) return next();
  return res.status(401).json({ error: "Unauthorized." });
}

// ---------------- SSE (eventos en vivo) ----------------
const sseClients = [];
function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try { sseClients[i].write(payload); } catch (e) { sseClients.splice(i, 1); }
  }
}

app.get("/api/events", requireStore, (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  res.write(`event: connected\ndata: ${JSON.stringify({ ok: true })}\n\n`);
  sseClients.push(res);
  const heartbeat = setInterval(() => {
    try { res.write(`event: ping\ndata: {}\n\n`); } catch (e) { clearInterval(heartbeat); }
  }, 25000);
  req.on("close", () => {
    clearInterval(heartbeat);
    const i = sseClients.indexOf(res);
    if (i >= 0) sseClients.splice(i, 1);
  });
});

// ---------------- API: catálogo y ajustes ----------------
app.get("/api/catalog", async (req, res) => {
  res.json(await db.getCatalog());
});

app.put("/api/catalog", requireStore, async (req, res) => {
  const cat = req.body;
  if (!cat || !Array.isArray(cat.departments)) {
    return res.status(400).json({ error: "Invalid catalog format." });
  }
  await db.setCatalog(cat);
  broadcast("catalog-updated", { at: new Date().toISOString() });
  res.json({ ok: true });
});

app.get("/api/settings", async (req, res) => {
  const s = await db.getSettings();
  res.json({ openDays: s.openDays, slots: s.slots, capacity: s.capacity });
});

app.put("/api/settings", requireStore, async (req, res) => {
  const { openDays, slots, capacity } = req.body || {};
  if (!Array.isArray(openDays) || !Array.isArray(slots) || !slots.length || !(Number(capacity) > 0)) {
    return res.status(400).json({ error: "Invalid settings." });
  }
  const clean = {
    openDays: openDays.map(Number).filter((d) => d >= 0 && d <= 6),
    slots: slots.map((s) => String(s).trim().slice(0, 12)).filter(Boolean),
    capacity: Math.min(20, Math.max(1, Number(capacity)))
  };
  await db.setSettings(clean);
  broadcast("settings-updated", clean);
  res.json({ ok: true, settings: clean });
});

// ---------------- API: disponibilidad ----------------
function todayStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

app.get("/api/availability", async (req, res) => {
  const date = String(req.query.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Invalid date." });
  }
  const settings = await db.getSettings();
  const dow = new Date(date + "T12:00:00").getDay();
  if (!settings.openDays.includes(dow)) {
    return res.json({ date, open: false, slots: [] });
  }
  const slots = [];
  for (const time of settings.slots) {
    const used = await db.countActiveForSlot(date, time);
    slots.push({ time, used, left: Math.max(0, settings.capacity - used) });
  }
  res.json({ date, open: true, slots });
});

// ---------------- API: reservas ----------------
const VALID_STATUS = ["pending", "confirmed", "done", "cancelled", "no-show"];

function findItem(catalog, itemId) {
  for (const d of catalog.departments || []) {
    for (const c of d.categories || []) {
      for (const it of c.items || []) {
        if (it.id === itemId) return it;
      }
    }
  }
  return null;
}

// Público: los clientes reservan sin clave.
app.post("/api/bookings", async (req, res) => {
  const { serviceId, customer, date, time, notes } = req.body || {};

  if (!customer || !String(customer.name || "").trim() || !String(customer.phone || "").trim()) {
    return res.status(400).json({ error: "Name and phone are required." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || "")) || String(date) < todayStr()) {
    return res.status(400).json({ error: "Please pick a valid upcoming date." });
  }
  const settings = await db.getSettings();
  const dow = new Date(date + "T12:00:00").getDay();
  if (!settings.openDays.includes(dow)) {
    return res.status(400).json({ error: "We are closed that day. Please pick another date." });
  }
  if (!settings.slots.includes(time)) {
    return res.status(400).json({ error: "Please pick one of the available times." });
  }
  const catalog = await db.getCatalog();
  const item = findItem(catalog, serviceId);
  if (!item || !item.active) {
    return res.status(400).json({ error: "That service is not available right now." });
  }
  const used = await db.countActiveForSlot(date, time);
  if (used >= settings.capacity) {
    return res.status(409).json({ error: "That time just filled up. Please pick another time." });
  }

  const number = await db.nextBookingNumber();
  const booking = await db.createBooking({
    number,
    service: { id: item.id, name: item.name, nameEs: item.nameEs || "", price: item.price },
    customer: {
      name: String(customer.name).trim().slice(0, 80),
      phone: String(customer.phone).trim().slice(0, 30)
    },
    date,
    time,
    notes: String(notes || "").slice(0, 500)
  });

  broadcast("new-booking", booking);
  res.status(201).json(booking);
});

// Público: el cliente consulta el estado de su reserva.
app.get("/api/track", async (req, res) => {
  const { number, phone } = req.query;
  if (!number || !phone) return res.status(400).json({ error: "Booking number and phone required." });
  const b = await db.findByNumberAndPhone(number, phone);
  if (!b) return res.status(404).json({ error: "Booking not found. Check the number and phone." });
  res.json({
    number: b.number, service: b.service.name, serviceEs: b.service.nameEs || "", price: b.service.price,
    date: b.date, time: b.time, status: b.status
  });
});

// Solo gestión:
app.get("/api/bookings", requireStore, async (req, res) => {
  res.json(await db.listBookings());
});

app.patch("/api/bookings/:id", requireStore, async (req, res) => {
  const { status } = req.body || {};
  if (!VALID_STATUS.includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }
  const updated = await db.updateBookingStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: "Booking not found." });
  broadcast("booking-status", updated);
  res.json(updated);
});

// Limpieza selectiva: ?status=cancelled|done|... borra solo ese estado;
// sin parámetro borra todo. Borrar una sola: DELETE /api/bookings/:id
app.delete("/api/bookings/:id", requireStore, async (req, res) => {
  const ok = await db.deleteBooking(req.params.id);
  if (!ok) return res.status(404).json({ error: "Booking not found." });
  broadcast("bookings-cleared", {});
  res.json({ ok: true });
});

app.delete("/api/bookings", requireStore, async (req, res) => {
  const status = String(req.query.status || "");
  if (status) {
    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }
    const n = await db.deleteBookingsByStatus(status);
    broadcast("bookings-cleared", {});
    return res.json({ ok: true, deleted: n });
  }
  await db.deleteAllBookings();
  broadcast("bookings-cleared", {});
  res.json({ ok: true });
});

// ---------------- Páginas ----------------
app.use(express.static(path.join(__dirname, "public")));
app.get("/store", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "store.html"));
});

// ---------------- Arranque ----------------
db.init().then(() => {
  app.listen(PORT, () => {
    console.log(`[esthetics] Servidor corriendo en http://localhost:${PORT}`);
    console.log(`[esthetics] Clientes: http://localhost:${PORT}/`);
    console.log(`[esthetics] Gestión:  http://localhost:${PORT}/store`);
  });
}).catch((err) => {
  console.error("[esthetics] ❌ No se pudo inicializar la base de datos:", err.message);
  process.exit(1);
});
