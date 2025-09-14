-- AlterTable
ALTER TABLE "public"."storage_policies" ADD COLUMN     "flatDailyRateUsdCents" INTEGER,
ADD COLUMN     "maxDaysAllowed" INTEGER NOT NULL DEFAULT 90,
ALTER COLUMN "freeDays" DROP DEFAULT,
ALTER COLUMN "isActive" SET DEFAULT false;
