-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'REFRESH',
    "expiresAt" DATETIME NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tokens" ("createdAt", "expiresAt", "id", "isRevoked", "token", "type", "userId") SELECT "createdAt", "expiresAt", "id", "isRevoked", "token", "type", "userId" FROM "tokens";
DROP TABLE "tokens";
ALTER TABLE "new_tokens" RENAME TO "tokens";
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");
CREATE INDEX "tokens_userId_idx" ON "tokens"("userId");
CREATE INDEX "tokens_token_idx" ON "tokens"("token");
CREATE INDEX "tokens_expiresAt_idx" ON "tokens"("expiresAt");
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromAccountId" TEXT NOT NULL,
    "toAccountId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TRANSFER',
    "amount" REAL NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("amount", "createdAt", "description", "fromAccountId", "id", "status", "toAccountId", "type") SELECT "amount", "createdAt", "description", "fromAccountId", "id", "status", "toAccountId", "type" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
CREATE INDEX "transactions_fromAccountId_idx" ON "transactions"("fromAccountId");
CREATE INDEX "transactions_toAccountId_idx" ON "transactions"("toAccountId");
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");
