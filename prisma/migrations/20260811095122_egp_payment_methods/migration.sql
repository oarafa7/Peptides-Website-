/*
  Warnings:

  - You are about to drop the column `stripeCheckoutId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentIntentId` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('INSTAPAY', 'COD');

-- DropIndex
DROP INDEX "Order_stripeCheckoutId_key";

-- DropIndex
DROP INDEX "Order_stripePaymentIntentId_key";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "postalCode" DROP NOT NULL,
ALTER COLUMN "country" SET DEFAULT 'EG';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "stripeCheckoutId",
DROP COLUMN "stripePaymentIntentId",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD',
ADD COLUMN     "paymentReference" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "currency" SET DEFAULT 'egp';
