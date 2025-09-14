-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."PackageStatus" AS ENUM ('RECEIVED', 'READY_TO_SHIP', 'SHIPPED');

-- CreateEnum
CREATE TYPE "public"."ShipmentStatus" AS ENUM ('DRAFT', 'LABEL_CREATED', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SupportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."ConsolidationType" AS ENUM ('SIMPLE', 'REPACK');

-- CreateEnum
CREATE TYPE "public"."ConsolidationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ProtectionType" AS ENUM ('BUBBLE_WRAP', 'DOUBLE_BOX', 'SECURITY_TAPE', 'PAPER_FILLING', 'CUSTOM_PACKAGING');

-- CreateEnum
CREATE TYPE "public"."ProtectionCategory" AS ENUM ('BASIC_PROTECTION', 'PREMIUM_PROTECTION', 'FRAGILE_ITEMS', 'ELECTRONICS', 'CLOTHING', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."PackageSizeCategory" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'IN_APP');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- CreateTable
CREATE TABLE "public"."PlatformConfig" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyName" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "taxRate" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "handlingFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "storageFeePerDay" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "maxStorageDays" INTEGER NOT NULL DEFAULT 30,
    "consolidationBaseFeeUsdCents" INTEGER NOT NULL DEFAULT 500,
    "consolidationPerPackageUsdCents" INTEGER NOT NULL DEFAULT 100,
    "repackMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "defaultCarrier" TEXT NOT NULL DEFAULT 'USPS',
    "defaultService" TEXT NOT NULL DEFAULT 'Priority',
    "insuranceRequired" BOOLEAN NOT NULL DEFAULT false,
    "minInsuranceAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "stripeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "paypalEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autoInvoice" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "webhookUrl" TEXT,
    "shipstationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "shipstationApiKey" TEXT,
    "shipstationApiSecret" TEXT,
    "s3Enabled" BOOLEAN NOT NULL DEFAULT false,
    "s3BucketName" TEXT,
    "s3Region" TEXT,
    "maxFileSize" INTEGER NOT NULL DEFAULT 10485760,
    "maxLoginAttempts" INTEGER NOT NULL DEFAULT 5,
    "sessionTimeout" INTEGER NOT NULL DEFAULT 3600,
    "require2FA" BOOLEAN NOT NULL DEFAULT false,
    "supportEmail" TEXT,
    "supportPhone" TEXT,
    "businessHours" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'America/New_York',

    CONSTRAINT "PlatformConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "passwordHash" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'CUSTOMER',
    "customerCode" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Package" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3),
    "expectedDeliveryDate" TIMESTAMP(3),
    "actualDeliveryDate" TIMESTAMP(3),
    "store" TEXT,
    "orderNumber" TEXT,
    "purchasePrice" DECIMAL(10,2),
    "carrier" TEXT,
    "trackingIn" TEXT,
    "trackingPhoto" TEXT,
    "deliveryConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "declaredValue" DECIMAL(10,2),
    "weightGrams" INTEGER,
    "lengthCm" INTEGER,
    "widthCm" INTEGER,
    "heightCm" INTEGER,
    "status" "public"."PackageStatus" NOT NULL DEFAULT 'RECEIVED',
    "packageCondition" TEXT,
    "notes" TEXT,
    "shipmentId" TEXT,
    "consolidationStatus" "public"."ConsolidationStatus" NOT NULL DEFAULT 'PENDING',
    "consolidationGroupId" TEXT,
    "dimensionsId" TEXT,
    "protectionApplied" "public"."ProtectionType"[],
    "repackedAt" TIMESTAMP(3),
    "repackedBy" TEXT,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Shipment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "public"."ShipmentStatus" NOT NULL DEFAULT 'DRAFT',
    "outboundCarrier" TEXT,
    "outboundService" TEXT,
    "outboundLabel" TEXT,
    "trackingOut" TEXT,
    "totalWeightGrams" INTEGER,
    "insuranceUsd" DECIMAL(10,2),
    "carrierId" TEXT,
    "toName" TEXT,
    "toLine1" TEXT,
    "toLine2" TEXT,
    "toCity" TEXT,
    "toState" TEXT,
    "toPostalCode" TEXT,
    "toCountry" TEXT,
    "toPhone" TEXT,
    "toEmail" TEXT,
    "paymentProvider" TEXT,
    "paymentStatus" TEXT,
    "paymentAmount" DECIMAL(10,2),

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provider" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "amountCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "receiptUrl" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "amountCents" INTEGER NOT NULL,
    "pdfUrl" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentMethod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "brand" TEXT,
    "last4" TEXT,
    "expMonth" INTEGER,
    "expYear" INTEGER,
    "default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupportTicket" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "public"."SupportStatus" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupportReply" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "hasApi" BOOLEAN NOT NULL DEFAULT false,
    "apiKey" TEXT,
    "apiSecret" TEXT,
    "apiUrl" TEXT,
    "baseRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ratePerKg" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ratePerKm" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "insuranceAvailable" BOOLEAN NOT NULL DEFAULT false,
    "insuranceRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "minInsuranceValue" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "maxInsuranceValue" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "estimatedDays" INTEGER NOT NULL DEFAULT 3,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carrier_services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "baseRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ratePerKg" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ratePerKm" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "estimatedDays" INTEGER NOT NULL DEFAULT 3,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "carrierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carrier_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carrier_zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ratePerKg" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "estimatedDays" INTEGER NOT NULL DEFAULT 3,
    "carrierId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carrier_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."package_dimensions" (
    "id" TEXT NOT NULL,
    "length" DECIMAL(8,2) NOT NULL,
    "width" DECIMAL(8,2) NOT NULL,
    "height" DECIMAL(8,2) NOT NULL,
    "weight" DECIMAL(8,2) NOT NULL,
    "volume" DECIMAL(10,2) NOT NULL,
    "sizeCategory" "public"."PackageSizeCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_dimensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."protection_services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "protectionType" "public"."ProtectionType" NOT NULL,
    "category" "public"."ProtectionCategory" NOT NULL,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "pricePerKg" DECIMAL(10,2) NOT NULL,
    "pricePerDimension" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "protection_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."storage_policies" (
    "id" TEXT NOT NULL,
    "freeDays" INTEGER NOT NULL DEFAULT 30,
    "dailyRateSmall" DECIMAL(10,2) NOT NULL,
    "dailyRateMedium" DECIMAL(10,2) NOT NULL,
    "dailyRateLarge" DECIMAL(10,2) NOT NULL,
    "dailyRatePerItem" DECIMAL(10,2) NOT NULL,
    "weekendCharges" BOOLEAN NOT NULL DEFAULT false,
    "holidayCharges" BOOLEAN NOT NULL DEFAULT false,
    "warningDays" INTEGER NOT NULL DEFAULT 7,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."consolidation_groups" (
    "id" TEXT NOT NULL,
    "consolidationType" "public"."ConsolidationType" NOT NULL,
    "status" "public"."ConsolidationStatus" NOT NULL DEFAULT 'PENDING',
    "extraProtection" "public"."ProtectionType"[],
    "removeInvoice" BOOLEAN NOT NULL DEFAULT false,
    "customInstructions" TEXT,
    "finalWeightGrams" INTEGER,
    "beforePhotos" TEXT[],
    "afterPhotos" TEXT[],
    "consolidationFee" DECIMAL(10,2) NOT NULL,
    "storageDaysAllowed" INTEGER NOT NULL DEFAULT 30,
    "storageDaysUsed" INTEGER NOT NULL DEFAULT 0,
    "storageFee" DECIMAL(10,2) NOT NULL,
    "consolidationDeadline" TIMESTAMP(3) NOT NULL,
    "shippingDeadline" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "finalDimensionsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consolidation_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "public"."NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" TEXT,
    "newValues" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parameters" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "resultUrl" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_notification_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "consolidationUpdates" BOOLEAN NOT NULL DEFAULT true,
    "storageWarnings" BOOLEAN NOT NULL DEFAULT true,
    "deliveryUpdates" BOOLEAN NOT NULL DEFAULT true,
    "systemAnnouncements" BOOLEAN NOT NULL DEFAULT true,
    "digestFrequency" TEXT NOT NULL DEFAULT 'DAILY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_customerCode_key" ON "public"."User"("customerCode");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "public"."Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "public"."Invoice"("number");

-- CreateIndex
CREATE UNIQUE INDEX "carriers_code_key" ON "public"."carriers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "protection_services_code_key" ON "public"."protection_services"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_notification_settings_userId_key" ON "public"."user_notification_settings"("userId");

-- AddForeignKey
ALTER TABLE "public"."Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Package" ADD CONSTRAINT "Package_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Package" ADD CONSTRAINT "Package_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "public"."Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Package" ADD CONSTRAINT "Package_dimensionsId_fkey" FOREIGN KEY ("dimensionsId") REFERENCES "public"."package_dimensions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Package" ADD CONSTRAINT "Package_consolidationGroupId_fkey" FOREIGN KEY ("consolidationGroupId") REFERENCES "public"."consolidation_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shipment" ADD CONSTRAINT "Shipment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shipment" ADD CONSTRAINT "Shipment_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "public"."carriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportReply" ADD CONSTRAINT "SupportReply_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."SupportTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportReply" ADD CONSTRAINT "SupportReply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carrier_services" ADD CONSTRAINT "carrier_services_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "public"."carriers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carrier_zones" ADD CONSTRAINT "carrier_zones_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "public"."carriers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consolidation_groups" ADD CONSTRAINT "consolidation_groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consolidation_groups" ADD CONSTRAINT "consolidation_groups_finalDimensionsId_fkey" FOREIGN KEY ("finalDimensionsId") REFERENCES "public"."package_dimensions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_notification_settings" ADD CONSTRAINT "user_notification_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
