/*
  Warnings:

  - The values [COMPLETED] on the enum `ConsolidationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ConsolidationStatus_new" AS ENUM ('OPEN', 'PENDING', 'IN_PROGRESS', 'READY_TO_SHIP', 'SHIPPED', 'CANCELLED');
ALTER TABLE "public"."Package" ALTER COLUMN "consolidationStatus" DROP DEFAULT;
ALTER TABLE "public"."consolidation_groups" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Package" ALTER COLUMN "consolidationStatus" TYPE "public"."ConsolidationStatus_new" USING ("consolidationStatus"::text::"public"."ConsolidationStatus_new");
ALTER TABLE "public"."consolidation_groups" ALTER COLUMN "status" TYPE "public"."ConsolidationStatus_new" USING ("status"::text::"public"."ConsolidationStatus_new");
ALTER TYPE "public"."ConsolidationStatus" RENAME TO "ConsolidationStatus_old";
ALTER TYPE "public"."ConsolidationStatus_new" RENAME TO "ConsolidationStatus";
DROP TYPE "public"."ConsolidationStatus_old";
ALTER TABLE "public"."Package" ALTER COLUMN "consolidationStatus" SET DEFAULT 'PENDING';
ALTER TABLE "public"."consolidation_groups" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Package" ADD COLUMN     "weighedAt" TIMESTAMP(3),
ADD COLUMN     "weighedBy" TEXT,
ADD COLUMN     "weightNotes" TEXT;

-- AlterTable
ALTER TABLE "public"."PlatformConfig" ADD COLUMN     "freightMarkupMaxAmount" INTEGER NOT NULL DEFAULT 5000,
ADD COLUMN     "freightMarkupMinAmount" INTEGER NOT NULL DEFAULT 200,
ADD COLUMN     "freightMarkupPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
ADD COLUMN     "processingFeeUsdCents" INTEGER NOT NULL DEFAULT 300;

-- AlterTable
ALTER TABLE "public"."consolidation_groups" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "currentWeightGrams" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "estimatedFinalWeightGrams" INTEGER,
ADD COLUMN     "maxItemsAllowed" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'OPEN',
ALTER COLUMN "consolidationDeadline" DROP NOT NULL,
ALTER COLUMN "shippingDeadline" DROP NOT NULL;
