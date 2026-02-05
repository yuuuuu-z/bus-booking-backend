import prisma from "../lib/prisma.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user?.id;

    const {
      fromProvinceId,
      toProvinceId,
      travelDate,
      timeLabel,
      startTime,
      endTime,
      tickets,
    } = req.body;

    // 1. Validate required fields
    if (
      !fromProvinceId ||
      !toProvinceId ||
      !travelDate ||
      !timeLabel ||
      !startTime ||
      !endTime ||
      !tickets
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. Prevent same province booking
    if (fromProvinceId === toProvinceId) {
      return res.status(400).json({
        message: "From and To province cannot be the same",
      });
    }

    // 3. Validate tickets
    if (tickets <= 0) {
      return res.status(400).json({
        message: "Number of tickets must be at least 1",
      });
    }

    // 4. Check if provinces actually exist
    const fromProvince = await prisma.province.findUnique({
      where: { id: fromProvinceId },
    });

    const toProvince = await prisma.province.findUnique({
      where: { id: toProvinceId },
    });

    if (!fromProvince || !toProvince) {
      return res.status(404).json({
        message: "Invalid province selected",
      });
    }

    // 5. Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        fromProvinceId,
        toProvinceId,
        travelDate: new Date(travelDate),
        timeLabel,
        startTime,
        endTime,
        tickets,
      },
      include: {
        fromProvince: true,
        toProvince: true,
      },
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking Error:", error);

    res.status(500).json({
      message: "Failed to create booking",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getTrips = async (req, res) => {
  const trips = await prisma.booking.findMany({
    include: {
      fromProvince: true,
      toProvince: true,
    },
  });

  res.json(trips);
};

export const deleteBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = parseInt(req.params.id);

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this booking",
      });
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    res.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};
