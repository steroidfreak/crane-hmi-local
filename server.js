const path = require("path");
const express = require("express");
const mqtt = require("mqtt");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = Number(process.env.PORT || 3000);

const MQTT_HOST = process.env.MQTT_HOST || "143.198.80.199";
const MQTT_PORT = Number(process.env.MQTT_PORT || 1883);
const MQTT_USERNAME = process.env.MQTT_USERNAME || "lightsuser";
const MQTT_PASSWORD = process.env.MQTT_PASSWORD || "light";

const MQTT_CMD_TOPIC = process.env.MQTT_CMD_TOPIC || "lights/cmd";
const MQTT_STATE_TOPIC = process.env.MQTT_STATE_TOPIC || "lights/state";

const mqttUrl = `mqtt://${MQTT_HOST}:${MQTT_PORT}`;
console.log("Connecting MQTT:", mqttUrl);

const client = mqtt.connect(mqttUrl, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    keepalive: 60,
    reconnectPeriod: 2000,
});

function clamp254(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return null;
    return Math.max(0, Math.min(254, Math.round(x)));
}

let lastState = {
    boom: "unknown",
    trolley: "unknown",
    trolleyLevel254: 0,
    lightLevel254: 0,
    daliOk: true,
    raw: null,
    ts: null,
};

client.on("connect", () => {
    console.log("✅ MQTT connected");
    client.subscribe(MQTT_STATE_TOPIC, (err) => {
        if (err) console.error("❌ subscribe error:", err.message);
        else console.log("✅ subscribed:", MQTT_STATE_TOPIC);
    });
});

client.on("message", (topic, payload) => {
    if (topic !== MQTT_STATE_TOPIC) return;
    const msg = payload.toString("utf8");
    try {
        const obj = JSON.parse(msg);
        const tl = clamp254(obj.trolleyLevel254);
        const ll = clamp254(obj.lightLevel254);

        lastState = {
            boom: obj.boom ?? lastState.boom,
            trolley: obj.trolley ?? lastState.trolley,
            trolleyLevel254: tl !== null ? tl : lastState.trolleyLevel254,
            lightLevel254: ll !== null ? ll : lastState.lightLevel254,
            daliOk: (typeof obj.daliOk === "boolean") ? obj.daliOk : lastState.daliOk,
            raw: obj,
            ts: Date.now(),
        };
    } catch { }
});

function publishCmd(obj) {
    return new Promise((resolve, reject) => {
        client.publish(MQTT_CMD_TOPIC, JSON.stringify(obj), { qos: 0, retain: false }, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// Boom (PLC parses "cmd":"on/off")
app.post("/api/boom/on", async (req, res) => {
    try { await publishCmd({ cmd: "on" }); res.json({ ok: true }); }
    catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});
app.post("/api/boom/off", async (req, res) => {
    try { await publishCmd({ cmd: "off" }); res.json({ ok: true }); }
    catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// Trolley loop (PLC parses "trolley":"on/off")
app.post("/api/trolley/on", async (req, res) => {
    try { await publishCmd({ trolley: "on" }); res.json({ ok: true }); }
    catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});
app.post("/api/trolley/off", async (req, res) => {
    try { await publishCmd({ trolley: "off" }); res.json({ ok: true }); }
    catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// Manual trolley level (PLC parses trolleyLevel254)
app.post("/api/trolley/level", async (req, res) => {
    const level254 = clamp254(req.body?.level254);
    if (level254 === null) return res.status(400).json({ ok: false, error: "level254 must be 0..254" });
    try { await publishCmd({ trolleyLevel254: level254 }); res.json({ ok: true, trolleyLevel254: level254 }); }
    catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// Manual light level (PLC parses lightLevel254)
app.post("/api/light", async (req, res) => {
    const level254 = clamp254(req.body?.level254);
    if (level254 === null) return res.status(400).json({ ok: false, error: "level254 must be 0..254" });
    try { await publishCmd({ lightLevel254: level254 }); res.json({ ok: true, lightLevel254: level254 }); }
    catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get("/api/state", (req, res) => res.json(lastState));

app.get("/api/health", (req, res) => {
    res.json({ ok: true, mqttConnected: client.connected, mqttUrl });
});

app.listen(PORT, () => console.log(`✅ Web: http://localhost:${PORT}`));
