import prisma from "../lib/prisma.js";

/**
 * GET /provinces
 */
export const getProvinces = async (req, res) => {
  try {
    const provinces = await prisma.province.findMany({
      orderBy: { name: "asc" },
    });

    res.json(provinces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
