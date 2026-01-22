import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

/**
 * GET /users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /users
 */
export const createUser = async (req, res) => {
    try {
      const { email, password, phone, name } = req.body;
  
      if (!email || !password || !name) {
        return res.status(400).json({ message: "Email, password, name required" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          phone,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          createdAt: true,
        },
      });
  
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

/**
 * PUT /users/:id
 */
export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { email, password, name, phone } = req.body;

    const data = {};

    if (email) data.email = email;
    if (name) data.name = name;
    if (phone) data.phone = phone;

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * DELETE /users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
