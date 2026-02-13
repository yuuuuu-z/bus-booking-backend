import prisma from "../lib/prisma.js";

export const getTopDestinationProvinces = async (req, res) => {
  try {
    const topProvinces = await prisma.booking.groupBy({
  by: ["toProvinceId"],
  where: {
    status: "PAID",
  },
  _count: {
    toProvinceId: true,
  },
  orderBy: {
    _count: {
      toProvinceId: "desc",
    },
  },
  take: 10,
});

    // Get province details
    const provinceIds = topProvinces.map(p => p.toProvinceId);

    const provinces = await prisma.province.findMany({
      where: {
        id: { in: provinceIds },
      },
    });

    const result = topProvinces.map(item => {
      const province = provinces.find(p => p.id === item.toProvinceId);
      return {
        name: province?.name || "Unknown",
         provinceId: province?.id || null,
        booking: item._count.toProvinceId ,
        image: province?.image || null
      };
    });

    res.json({message: "Top 10 provinces with the most bookings",data:result, });
  } catch (error) { 
    console.error("Top Provinces Error:", error);
    res.status(500).json({ message: "Failed to fetch top provinces" });
  }
};
