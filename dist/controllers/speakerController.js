"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpeaker = exports.updateSpeaker = exports.createSpeaker = exports.getSpeakerById = exports.getSpeakers = void 0;
const db_js_1 = require("../lib/db.js");
const logError_js_1 = require("../lib/logError.js");
const getSpeakers = async (_req, res) => {
    try {
        const speakers = await db_js_1.prisma.speaker.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(speakers);
    }
    catch (err) {
        (0, logError_js_1.logDbError)("getSpeakers", err);
        res.status(500).json({ error: "Gagal mengambil data speaker" });
    }
};
exports.getSpeakers = getSpeakers;
const getSpeakerById = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID tidak valid" });
    }
    try {
        const speaker = await db_js_1.prisma.speaker.findUnique({ where: { id } });
        if (!speaker) {
            return res.status(404).json({ error: "Speaker tidak ditemukan" });
        }
        res.json(speaker);
    }
    catch {
        res.status(500).json({ error: "Gagal mengambil data speaker" });
    }
};
exports.getSpeakerById = getSpeakerById;
const createSpeaker = async (req, res) => {
    const { name, role, image } = req.body;
    if (!name || !role) {
        return res.status(400).json({ error: "Nama dan role wajib diisi" });
    }
    try {
        const speaker = await db_js_1.prisma.speaker.create({
            data: {
                name: String(name).trim(),
                role: String(role).trim(),
                image: image ? String(image).trim() : "",
            },
        });
        res.status(201).json(speaker);
    }
    catch {
        res.status(500).json({ error: "Gagal membuat speaker" });
    }
};
exports.createSpeaker = createSpeaker;
const updateSpeaker = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID tidak valid" });
    }
    const { name, role, image } = req.body;
    try {
        const speaker = await db_js_1.prisma.speaker.update({
            where: { id },
            data: {
                ...(name !== undefined && { name: String(name).trim() }),
                ...(role !== undefined && { role: String(role).trim() }),
                ...(image !== undefined && { image: String(image).trim() }),
            },
        });
        res.json(speaker);
    }
    catch {
        res.status(404).json({ error: "Speaker tidak ditemukan" });
    }
};
exports.updateSpeaker = updateSpeaker;
const deleteSpeaker = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID tidak valid" });
    }
    try {
        await db_js_1.prisma.speaker.delete({ where: { id } });
        res.json({ message: "Speaker berhasil dihapus" });
    }
    catch {
        res.status(404).json({ error: "Speaker tidak ditemukan" });
    }
};
exports.deleteSpeaker = deleteSpeaker;
//# sourceMappingURL=speakerController.js.map