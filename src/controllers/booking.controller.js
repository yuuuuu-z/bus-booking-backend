
import prisma from "../lib/prisma.js";
import axios from "axios";
import crypto from "crypto";
import QRCode from "qrcode";
import {
  BakongKHQR,
  IndividualInfo,
  khqrData,
} from "bakong-khqr";


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

const checkPaymentStatus = async (md5) => {
  // --- TEST MODE: Bypass Bakong API if token is invalid but we are in dev ---
  if (process.env.NODE_ENV === "development" && md5 === "DEBUG_SUCCESS") {
    return { transactionStatus: "SUCCESS" };
  }

  if (!md5) {
    console.error("[checkPaymentStatus] MD5 is missing!");
    return { transactionStatus: "FAILED", error: "MD5 is missing in database" };
  }

  const token = process.env.BAKONG_ACCESS_TOKEN;
  if (!token) {
    console.error("[checkPaymentStatus] BAKONG_ACCESS_TOKEN is missing in process.env!");
    return { transactionStatus: "FAILED", error: "BAKONG_ACCESS_TOKEN is missing in .env/Vercel" };
  }

  try {
    // 1. Try Production URL
    const prodUrl = process.env.BAKONG_PROD_BASE_API_URL || "https://api-bakong.nbc.gov.kh/v1";
    console.log(`[checkPaymentStatus] Env: ${process.env.NODE_ENV} | Trying PROD: ${prodUrl} | MD5: ${md5}`);
    console.log(`[checkPaymentStatus] Token (first/last 6): ${token.substring(0, 6)}...${token.substring(token.length - 6)}`);

    const headers = { 
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/json',
      'Origin': 'https://bakong.nbc.gov.kh',
      'Referer': 'https://bakong.nbc.gov.kh/',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    const response = await axios.post(
      `${prodUrl}/check_transaction_by_md5`,
      { md5 },
      { headers }
    );

    if (response.data && response.data.responseCode === 0) {
      console.log("[checkPaymentStatus] FOUND in PROD ✅");
      return { transactionStatus: "SUCCESS", data: response.data.data };
    }
    
    // 2. Fallback to SIT URL (even in production, if not found in PROD)
    console.log(`[checkPaymentStatus] PROD returned code: ${response.data?.responseCode}. Now trying SIT...`);
    const devUrl = process.env.BAKONG_DEV_BASE_API_URL || "https://sit-api-bakong.nbc.gov.kh/v1";
    
    const devResponse = await axios.post(
      `${devUrl}/check_transaction_by_md5`,
      { md5 },
      { headers }
    );
    
    if (devResponse.data && devResponse.data.responseCode === 0) {
      console.log("[checkPaymentStatus] FOUND in SIT ✅");
      return { transactionStatus: "SUCCESS", data: devResponse.data.data };
    }

    console.log("[checkPaymentStatus] NOT FOUND in both PROD and SIT ❌");
    return { transactionStatus: "PENDING", rawResponse: { prod: response.data, sit: devResponse.data } }; 

  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error(`[checkPaymentStatus] AXIOS ERROR: ${error.message}`);
    
    if (error.response?.status === 403) {
      console.error("[checkPaymentStatus] 403 Forbidden from CloudFront/Bakong. Error Data:", JSON.stringify(errorData));
      return { 
        transactionStatus: "FAILED", 
        error: "403 Forbidden. Your Vercel IP or User-Agent might be blocked, or token is invalid.",
        details: errorData,
        tip: "Check Vercel Dashboard -> Functions -> Logs for the full error HTML."
      };
    }
    return { transactionStatus: "FAILED", error: error.message, details: errorData };
  }
};

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
    const pricePerTicket = 0.10;
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

    // 5.1 Prepare KHQR data
    const expirationTimestamp = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    const optionalData  = {
      currency: khqrData.currency.usd,
      amount: totalPrice,
      mobileNumber: process.env.BAKONG_PHONE_NUMBER,
      storeLabel: "Bus Booking",
      terminalLabel: "Online",
      purposeOfTransaction: "Bus Ticket Booking",
      languagePreference: "km",
      merchantNameAlternateLanguage: process.env.BAKONG_ACCOUNT_NAME,
      merchantCityAlternateLanguage: "Phnom Penh",
      expirationTimestamp
    };

    const individualInfo = new IndividualInfo(
      process.env.BAKONG_ACCOUNT_USERNAME,
      process.env.BAKONG_ACCOUNT_NAME,
      "Phnom Penh",
      optionalData
    );

    const khqr = new BakongKHQR();
    const qrData = khqr.generateIndividual(individualInfo)

    if (qrData.status.code !== 0) {
      return res.status(400).json({
        message: "Failed to generate KHQR",
        error: qrData.status.message,
      });
    }

    // 6. Create booking FIRST
    console.log("[createBooking] Saving booking with MD5:", qrData.data.md5);

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
        totalPrice,
        pricePerTicket,
        status: "PENDING",
        paymentRef: qrData.data.md5 || null, // Ensure MD5 is stored
      },
      include: {
        fromProvince: true,
        toProvince: true,
      },
    });

    // 7. Return response
    res.status(201).json({
      message: "Booking is in pending status. Please complete payment.",
      userEmail: req.user?.email,
      payment: {
        qr: qrData.data.qr,
        md5: qrData.data.md5,
        currency: "USD",
        amount: totalPrice,
        expirationTimestamp,
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

    const isMock = req.query.mock === "success";
    const status = await checkPaymentStatus(isMock ? "DEBUG_SUCCESS" : booking.paymentRef);

    console.log("[verifyPayment] Status result:", status);

    if (status.transactionStatus === "SUCCESS") {
      const checkInToken = booking.checkInToken || crypto.randomBytes(32).toString("hex");
      
      await prisma.booking.update({
        where: { id: booking.id },
        data: { 
          status: "PAID",
          bakongHash: status.data.hash,
          currency: status.data.currency,
          amount: parseFloat(status.data.amount),
          paidAt: new Date(),
          checkInToken
        },
      });

      // Generate Check-in QR Code
      // In a real app, this URL should be the frontend URL or a public API URL
      const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 8000}`;
      const checkInUrl = `${baseUrl}/booking/check-in/${checkInToken}`;
      const qrCodeDataUrl = await QRCode.toDataURL(checkInUrl);

      return res.json({
        message: "Payment successful",
        data: {
          ...status.data,
          checkInToken,
          checkInUrl,
          qrCode: qrCodeDataUrl
        }
      });
    }

    res.json({
      message: "Payment not completed yet",
      status: status.transactionStatus,
      debug: status
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const checkIn = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Check-in token is required" });
    }

    const booking = await prisma.booking.findUnique({
      where: { checkInToken: token },
      include: {
        user: { select: { name: true, email: true } },
        fromProvince: true,
        toProvince: true,
      }
    });

    if (!booking) {
      return res.status(404).json({ message: "Invalid check-in token" });
    }

    if (booking.isCheckedIn) {
      return res.json({
        message: "Ticket already checked in",
        checkedInAt: booking.checkedInAt,
        booking
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        isCheckedIn: true,
        checkedInAt: new Date(),
      },
    });

    res.json({
      message: "Check-in successful! Welcome To BusGo.",
      booking: {
        ...updatedBooking,
        user: booking.user,
        fromProvince: booking.fromProvince,
        toProvince: booking.toProvince
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to check in",
      error: error.message
    });
  }
};
