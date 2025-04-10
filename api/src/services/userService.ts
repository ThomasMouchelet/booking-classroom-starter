import prisma from "../lib/prisma";
import { hashPassword } from "../utils/password";
import { CreateUserInput, UpdateUserInput } from "../schemas/userSchema";

export class UserService {
  static async createUser(data: CreateUserInput) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(data.password);

    // Créer l'utilisateur
    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async getCurrentUser(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async updateUser(id: number, data: UpdateUserInput) {
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("Utilisateur non trouvé");
    }

    // Si un nouveau mot de passe est fourni, le hasher
    const updateData = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    // Mettre à jour l'utilisateur
    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
