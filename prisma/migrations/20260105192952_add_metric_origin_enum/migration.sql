-- CreateEnum
CREATE TYPE "MetricOrigin" AS ENUM ('INTERNAL', 'EXTERNAL');

-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "origin" "MetricOrigin" NOT NULL DEFAULT 'INTERNAL';
