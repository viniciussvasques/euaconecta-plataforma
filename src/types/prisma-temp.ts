/**
 * Temporary Prisma types for build compatibility
 * These should be replaced with actual @prisma/client exports once Prisma client is generated
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT',
  SUPPORT = 'SUPPORT'
}

export enum ConsolidationType {
  SIMPLE = 'SIMPLE',
  REPACK = 'REPACK'
}

export enum ProtectionType {
  BUBBLE_WRAP = 'BUBBLE_WRAP',
  DOUBLE_BOX = 'DOUBLE_BOX',
  SECURITY_TAPE = 'SECURITY_TAPE',
  PAPER_FILLING = 'PAPER_FILLING',
  CUSTOM_PACKAGING = 'CUSTOM_PACKAGING'
}

export enum PackageStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  READY_TO_SHIP = 'READY_TO_SHIP',
  SHIPPED = 'SHIPPED'
}

export enum ConsolidationStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_TO_SHIP = 'READY_TO_SHIP',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  SYSTEM = 'SYSTEM',
  IN_APP = 'IN_APP'
}

// Add other commonly used Prisma types as needed