import Prisma from "../config/prisma.config.js";

export class NotesService {
  static async createNote(noteData) {
    try {
      const { name, description } = noteData;

      if (!name || !description) {
        throw new Error("Name and description are required");
      }

      const note = await Prisma.notes.create({
        data: {
          name: name.trim(),
          body: description.trim(),
        },
      });

      return note;
    } catch (error) {
      throw new Error(`Failed to create note: ${error.message}`);
    }
  }

  static async getAllNotes(filters = {}) {
    try {
      const { search, limit, offset } = filters;

      const whereClause = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { body: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      const notes = await Prisma.notes.findMany({
        where: whereClause,
        orderBy: { create_at: "desc" },
        ...(limit && { take: parseInt(limit) }),
        ...(offset && { skip: parseInt(offset) }),
      });

      const total = await Prisma.notes.count({ where: whereClause });

      return { notes, total };
    } catch (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
  }

  static async getNoteById(noteId) {
    try {
      if (!noteId) {
        throw new Error("Note ID is required");
      }

      const note = await Prisma.notes.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        throw new Error("Note not found");
      }

      return note;
    } catch (error) {
      throw new Error(`Failed to fetch note: ${error.message}`);
    }
  }

  static async updateNote(noteId, updateData) {
    try {
      if (!noteId) {
        throw new Error("Note ID is required");
      }

      const { name, description } = updateData;

      if (!name && !description) {
        throw new Error("At least one field (name or description) is required");
      }

      const existingNote = await Prisma.notes.findUnique({
        where: { id: noteId },
      });

      if (!existingNote) {
        throw new Error("Note not found");
      }

      const dataToUpdate = {};
      if (name) dataToUpdate.name = name.trim();
      if (description) dataToUpdate.body = description.trim();

      const updatedNote = await Prisma.notes.update({
        where: { id: noteId },
        data: dataToUpdate,
      });

      return updatedNote;
    } catch (error) {
      throw new Error(`Failed to update note: ${error.message}`);
    }
  }

  static async deleteNote(noteId) {
    try {
      if (!noteId) {
        throw new Error("Note ID is required");
      }

      const existingNote = await Prisma.notes.findUnique({
        where: { id: noteId },
      });

      if (!existingNote) {
        throw new Error("Note not found");
      }

      const deletedNote = await Prisma.notes.delete({
        where: { id: noteId },
      });

      return deletedNote;
    } catch (error) {
      throw new Error(`Failed to delete note: ${error.message}`);
    }
  }

  static async getNotesStats() {
    try {
      const totalNotes = await Prisma.notes.count();
      const recentNotes = await Prisma.notes.count({
        where: {
          create_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      });

      return {
        total: totalNotes,
        recentlyCreated: recentNotes,
      };
    } catch (error) {
      throw new Error(`Failed to fetch stats: ${error.message}`);
    }
  }
}
