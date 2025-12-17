/*
  Warnings:

  - Added the required column `updatedAt` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" ADD COLUMN "ipAddress" TEXT;
ALTER TABLE "tokens" ADD COLUMN "userAgent" TEXT;

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "changes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "agency" TEXT NOT NULL DEFAULT '0001',
    "type" TEXT NOT NULL DEFAULT 'CHECKING',
    "balance" REAL NOT NULL DEFAULT 0,
    "dailyLimit" REAL NOT NULL DEFAULT 2000.00,
    "monthlyLimit" REAL NOT NULL DEFAULT 10000.00,
    "totalDeposited" REAL NOT NULL DEFAULT 0,
    "totalWithdrawn" REAL NOT NULL DEFAULT 0,
    "totalTransfers" REAL NOT NULL DEFAULT 0,
    "lastTransactionAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "blockedReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_accounts" ("accountNumber", "agency", "balance", "createdAt", "id", "isActive", "type", "updatedAt", "userId") SELECT "accountNumber", "agency", "balance", "createdAt", "id", "isActive", "type", "updatedAt", "userId" FROM "accounts";
DROP TABLE "accounts";
ALTER TABLE "new_accounts" RENAME TO "accounts";
CREATE UNIQUE INDEX "accounts_accountNumber_key" ON "accounts"("accountNumber");
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");
CREATE INDEX "accounts_accountNumber_idx" ON "accounts"("accountNumber");
CREATE INDEX "accounts_agency_idx" ON "accounts"("agency");
CREATE INDEX "accounts_type_idx" ON "accounts"("type");
CREATE INDEX "accounts_createdAt_idx" ON "accounts"("createdAt");
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'TRANSFER',
    "amount" REAL NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "previousBalance" REAL,
    "newBalance" REAL,
    "fromAccountId" TEXT,
    "toAccountId" TEXT,
    "referenceId" TEXT,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reversedById" TEXT,
    "reversalReason" TEXT,
    CONSTRAINT "transactions_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "accounts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_reversedById_fkey" FOREIGN KEY ("reversedById") REFERENCES "transactions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("amount", "createdAt", "description", "fromAccountId", "id", "status", "toAccountId", "type") SELECT "amount", "createdAt", "description", "fromAccountId", "id", "status", "toAccountId", "type" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
CREATE UNIQUE INDEX "transactions_referenceId_key" ON "transactions"("referenceId");
CREATE UNIQUE INDEX "transactions_reversedById_key" ON "transactions"("reversedById");
CREATE INDEX "transactions_fromAccountId_idx" ON "transactions"("fromAccountId");
CREATE INDEX "transactions_toAccountId_idx" ON "transactions"("toAccountId");
CREATE INDEX "transactions_type_idx" ON "transactions"("type");
CREATE INDEX "transactions_status_idx" ON "transactions"("status");
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");
CREATE INDEX "transactions_referenceId_idx" ON "transactions"("referenceId");
CREATE UNIQUE INDEX "transactions_fromAccountId_toAccountId_amount_createdAt_key" ON "transactions"("fromAccountId", "toAccountId", "amount", "createdAt");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("birthDate", "cpf", "createdAt", "email", "id", "isActive", "name", "password", "updatedAt") SELECT "birthDate", "cpf", "createdAt", "email", "id", "isActive", "name", "password", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_cpf_idx" ON "users"("cpf");
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "tokens_type_idx" ON "tokens"("type");
