-- CreateTable
CREATE TABLE "province" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip" (
    "id" SERIAL NOT NULL,
    "fromProvinceId" INTEGER NOT NULL,
    "toProvinceId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "busNumber" TEXT,
    "plateNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "province_name_key" ON "province"("name");

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_fromProvinceId_fkey" FOREIGN KEY ("fromProvinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_toProvinceId_fkey" FOREIGN KEY ("toProvinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
