import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

export const getSpeakers = async (_req: Request, res: Response) => {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(speakers);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data speaker" });
  }
};

export const getSpeakerById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  try {
    const speaker = await prisma.speaker.findUnique({ where: { id } });

    if (!speaker) {
      return res.status(404).json({ error: "Speaker tidak ditemukan" });
    }

    res.json(speaker);
  } catch {
    res.status(500).json({ error: "Gagal mengambil data speaker" });
  }
};

export const createSpeaker = async (req: Request, res: Response) => {
  const { name, role, image } = req.body;

  if (!name || !role) {
    return res.status(400).json({ error: "Nama dan role wajib diisi" });
  }

  try {
    const speaker = await prisma.speaker.create({
      data: {
        name: String(name).trim(),
        role: String(role).trim(),
        image: image ? String(image).trim() : "",
      },
    });
    res.status(201).json(speaker);
  } catch {
    res.status(500).json({ error: "Gagal membuat speaker" });
  }
};

export const updateSpeaker = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  const { name, role, image } = req.body;

  try {
    const speaker = await prisma.speaker.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(role !== undefined && { role: String(role).trim() }),
        ...(image !== undefined && { image: String(image).trim() }),
      },
    });
    res.json(speaker);
  } catch {
    res.status(404).json({ error: "Speaker tidak ditemukan" });
  }
};

export const deleteSpeaker = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  try {
    await prisma.speaker.delete({ where: { id } });
    res.json({ message: "Speaker berhasil dihapus" });
  } catch {
    res.status(404).json({ error: "Speaker tidak ditemukan" });
  }
};
