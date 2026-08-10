-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "descriptionAr" TEXT,
ADD COLUMN     "nameAr" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "descriptionAr" TEXT,
ADD COLUMN     "materialsAr" TEXT,
ADD COLUMN     "shippingReturnsAr" TEXT,
ADD COLUMN     "titleAr" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "bodyAr" TEXT,
ADD COLUMN     "titleAr" TEXT;
