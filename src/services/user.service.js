import prisma from "../lib/prisma.js";

export const createUser = async (data) => {
  return prisma.user.create({ data });
};

export const getUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const getUsers = async () => {
  return prisma.user.findMany();
};
