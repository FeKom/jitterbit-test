/*
  Warnings:

  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_orderId_fkey";

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "orderId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "orders" DROP CONSTRAINT "orders_pkey",
ALTER COLUMN "orderId" DROP DEFAULT,
ALTER COLUMN "orderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("orderId");
DROP SEQUENCE "orders_orderId_seq";

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;
