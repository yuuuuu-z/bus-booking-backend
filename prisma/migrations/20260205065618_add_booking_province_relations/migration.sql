-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_fromProvinceId_fkey" FOREIGN KEY ("fromProvinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_toProvinceId_fkey" FOREIGN KEY ("toProvinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
