"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const db_js_1 = require("../lib/db.js");
const logError_js_1 = require("../lib/logError.js");
const getCategories = async (_req, res) => {
    try {
        const categories = await db_js_1.prisma.category.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(categories);
    }
    catch (err) {
        (0, logError_js_1.logDbError)("getCategories", err);
        res.status(500).json({ error: "Gagal mengambil data kategori" });
    }
};
exports.getCategories = getCategories;
const getCategoryById = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID tidak valid" });
    }
    try {
        const category = await db_js_1.prisma.category.findUnique({ where: { id } });
        if (!category) {
            return res.status(404).json({ error: "Kategori tidak ditemukan" });
        }
        res.json(category);
    }
    catch {
        res.status(500).json({ error: "Gagal mengambil data kategori" });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Nama kategori wajib diisi" });
    }
    try {
        const category = await db_js_1.prisma.category.create({
            data: { name: name.trim() },
        });
        res.status(201).json(category);
    }
    catch {
        res.status(500).json({ error: "Gagal membuat kategori" });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID tidak valid" });
    }
    const { name } = req.body;
    if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Nama kategori wajib diisi" });
    }
    try {
        const category = await db_js_1.prisma.category.update({
            where: { id },
            data: { name: name.trim() },
        });
        res.json(category);
    }
    catch {
        res.status(404).json({ error: "Kategori tidak ditemukan" });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID tidak valid" });
    }
    try {
        await db_js_1.prisma.category.delete({ where: { id } });
        res.json({ message: "Kategori berhasil dihapus" });
    }
    catch {
        res.status(404).json({ error: "Kategori tidak ditemukan atau masih dipakai event" });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoryController.js.map