"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getEvents = void 0;
const db_js_1 = require("../lib/db.js");
const logError_js_1 = require("../lib/logError.js");
const getEvents = async (_req, res) => {
    try {
        const events = await db_js_1.prisma.event.findMany({
            orderBy: { createdAt: "desc" },
            include: { category: true },
        });
        res.json(events);
    }
    catch (err) {
        (0, logError_js_1.logDbError)("getEvents", err);
        res.status(500).json({ error: "Gagal mengambil data event" });
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID tidak valid" });
    }
    try {
        const event = await db_js_1.prisma.event.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!event) {
            return res.status(404).json({ error: "Event tidak ditemukan" });
        }
        res.json(event);
    }
    catch {
        res.status(500).json({ error: "Gagal mengambil data event" });
    }
};
exports.getEventById = getEventById;
const createEvent = async (req, res) => {
    const { name, categoryId, location, dateEvent, description } = req.body;
    if (!name || !categoryId || !location || !dateEvent) {
        return res.status(400).json({
            error: "Nama, categoryId, lokasi, dan dateEvent wajib diisi",
        });
    }
    const parsedCategoryId = Number(categoryId);
    const parsedDate = new Date(dateEvent);
    if (Number.isNaN(parsedCategoryId) || Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "categoryId atau dateEvent tidak valid" });
    }
    try {
        const category = await db_js_1.prisma.category.findUnique({
            where: { id: parsedCategoryId },
        });
        if (!category) {
            return res.status(404).json({ error: "Kategori tidak ditemukan" });
        }
        const event = await db_js_1.prisma.event.create({
            data: {
                name: String(name).trim(),
                categoryId: parsedCategoryId,
                location: String(location).trim(),
                dateEvent: parsedDate,
                description: description ? String(description).trim() : "",
            },
            include: { category: true },
        });
        res.status(201).json(event);
    }
    catch {
        res.status(500).json({ error: "Gagal membuat event" });
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID tidak valid" });
    }
    const { name, categoryId, location, dateEvent, description } = req.body;
    if (categoryId !== undefined && Number.isNaN(Number(categoryId))) {
        return res.status(400).json({ error: "categoryId tidak valid" });
    }
    if (dateEvent !== undefined && Number.isNaN(new Date(dateEvent).getTime())) {
        return res.status(400).json({ error: "dateEvent tidak valid" });
    }
    try {
        if (categoryId !== undefined) {
            const category = await db_js_1.prisma.category.findUnique({
                where: { id: Number(categoryId) },
            });
            if (!category) {
                return res.status(404).json({ error: "Kategori tidak ditemukan" });
            }
        }
        const event = await db_js_1.prisma.event.update({
            where: { id },
            data: {
                ...(name !== undefined && { name: String(name).trim() }),
                ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
                ...(location !== undefined && { location: String(location).trim() }),
                ...(dateEvent !== undefined && { dateEvent: new Date(dateEvent) }),
                ...(description !== undefined && {
                    description: String(description).trim(),
                }),
            },
            include: { category: true },
        });
        res.json(event);
    }
    catch {
        res.status(404).json({ error: "Event tidak ditemukan" });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID tidak valid" });
    }
    try {
        await db_js_1.prisma.event.delete({ where: { id } });
        res.json({ message: "Event berhasil dihapus" });
    }
    catch {
        res.status(404).json({ error: "Event tidak ditemukan" });
    }
};
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=eventController.js.map