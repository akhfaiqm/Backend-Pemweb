import { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import { logDbError } from "../lib/logError.js";

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(categories);
  } catch (err) {
    logDbError("getCategories", err);
    res.status(500).json({ error: "Gagal mengambil data kategori" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  try {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return res.status(404).json({ error: "Kategori tidak ditemukan" });
    }

    res.json(category);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data kategori" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Nama kategori wajib diisi" });
  }

  try {
    const category = await prisma.category.create({
      data: { name: name.trim() },
    });
    res.status(201).json(category);
  } catch {
    res.status(500).json({ error: "Gagal membuat kategori" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Nama kategori wajib diisi" });
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });
    res.json(category);
  } catch {
    res.status(404).json({ error: "Kategori tidak ditemukan" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  try {
    await prisma.category.delete({ where: { id } });
    res.json({ message: "Kategori berhasil dihapus" });
  } catch {
    res.status(404).json({ error: "Kategori tidak ditemukan atau masih dipakai event" });
  }
};
