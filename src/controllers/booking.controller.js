import prisma from "../lib/prisma.js";


const TIME_LABEL_MAP = {
  morning: { startTime: "7:00 AM", endTime: "12:00 PM" },
  afternoon: { startTime: "12:00 PM", endTime: "5:00 PM" },
  evening: { startTime: "5:00 PM", endTime: "8:00 PM" },
  night: { startTime: "8:00 PM", endTime: "11:00 PM" },
};

function getTimesFromLabel(timeLabel) {
  const normalized = (timeLabel || "").trim().toLowerCase();
  return TIME_LABEL_MAP[normalized] ?? null;
}

export const createBooking = async (req, res) => {
  try {
    const userId = req.user?.id;

    const {
      fromProvinceId,
      toProvinceId,
      travelDate,
      timeLabel,
      startTime: bodyStartTime,
      endTime: bodyEndTime,
      tickets,
    } = req.body;

    // TODO: Determine actual price based on route/province
    const pricePerTicket = 5.0;
    const totalPrice = pricePerTicket * tickets;

    // 1. Validate required fields
    if (
      !fromProvinceId ||
      !toProvinceId ||
      !travelDate ||
      !timeLabel ||
      !tickets
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2. Resolve start/end time from label
    const labelTimes = getTimesFromLabel(timeLabel);
    const startTime = bodyStartTime ?? labelTimes?.startTime;
    const endTime = bodyEndTime ?? labelTimes?.endTime;

    if (!labelTimes) {
      return res.status(400).json({
        message:
          "Invalid time label. Use one of: Morning, Afternoon, Evening, Night.",
      });
    }

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "Start time and end time are required",
      });
    }

    // 3. Prevent same province booking
    if (fromProvinceId === toProvinceId) {
      return res.status(400).json({
        message: "From and To province cannot be the same",
      });
    }

    // 4. Validate tickets
    if (tickets <= 0) {
      return res.status(400).json({
        message: "Number of tickets must be at least 1",
      });
    }

    // 5. Check if provinces exist
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

    // 6. Create booking FIRST
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
        totalPrice, // <---- ADD THIS
        pricePerTicket, // <---- ADD THIS
        status: "PENDING", // <---- ADD THIS
      },
      include: {
        fromProvince: true,
        toProvince: true,
      },
    });

    // 7. Generate Bakong QR for payment
    
    res.status(201).json({
      message: "Booking created. Please complete payment.",
      userEmail: req.user?.email,

      payment: {
        totalPrice: totalPrice,
        currency: "USD",
       
      },

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

  res.json({
    userEmail: req.user?.email,

    trips,
  });
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
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const status = await checkPaymentStatus(booking.paymentRef);

    if (status.transactionStatus === "SUCCESS") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "PAID" },
      });

      return res.json({
        message: "Payment successful",
      });
    }

    res.json({
      message: "Payment not completed yet",
      status: status.transactionStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
