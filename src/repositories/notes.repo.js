import Prisma from "../config/prisma.config.js";

export class NotesRepository {
  static async create(noteData) {
    return await Prisma.notes.create({
      data: noteData,
    });
  }

  static async findMany(conditions = {}) {
    return await Prisma.notes.findMany(conditions);
  }

  static async findUnique(where) {
    return await Prisma.notes.findUnique({ where });
  }

  static async findById(id) {
    return await Prisma.notes.findUnique({
      where: { id },
    });
  }

  static async update(id, data) {
    return await Prisma.notes.update({
      where: { id },
      data,
    });
  }

  static async delete(id) {
    return await Prisma.notes.delete({
      where: { id },
    });
  }

  static async count(where = {}) {
    return await Prisma.notes.count({ where });
  }

  static async exists(id) {
    const count = await Prisma.notes.count({
      where: { id },
    });
    return count > 0;
  }

  static async findWithPagination({
    skip = 0,
    take = 10,
    where = {},
    orderBy = {},
  }) {
    const [notes, total] = await Promise.all([
      Prisma.notes.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      Prisma.notes.count({ where }),
    ]);

    return {
      notes,
      total,
      hasMore: skip + take < total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take),
    };
  }

  static async searchNotes(searchTerm, options = {}) {
    const { limit = 10, offset = 0 } = options;

    return await Prisma.notes.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            body: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      take: limit,
      skip: offset,
      orderBy: {
        create_at: "desc",
      },
    });
  }

  static async findByDateRange(startDate, endDate) {
    return await Prisma.notes.findMany({
      where: {
        create_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        create_at: "desc",
      },
    });
  }

  static async createMany(notesData) {
    return await Prisma.notes.createMany({
      data: notesData,
    });
  }

  static async updateMany(where, data) {
    return await Prisma.notes.updateMany({
      where,
      data,
    });
  }

  static async deleteMany(where) {
    return await Prisma.notes.deleteMany({
      where,
    });
  }
}