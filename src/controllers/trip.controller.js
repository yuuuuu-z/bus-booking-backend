import prisma from "../lib/prisma.js";

export const createTrip = async (req, res) => {
  try {
    const {
      fromProvinceId,
      toProvinceId,
      date,
      departureTime,
      price,
      totalSeats,
      availableSeats,
      busNumber,
      plateNumber,
    } = req.body;

    const trip = await prisma.trip.create({
      data: {
        fromProvinceId,
        toProvinceId,
        date: new Date(date),
        departureTime: new Date(departureTime),
        price,
        totalSeats,
        availableSeats,
        busNumber,
        plateNumber,
      },
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTrips = async (req, res) => {
  const trips = await prisma.trip.findMany({
    include: {
      fromProvince: true,
      toProvince: true,
    },
  });

  res.json(trips);
};
