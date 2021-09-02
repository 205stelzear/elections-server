/*
  Warnings:

  - You are about to drop the column `data` on the `elections` table. All the data in the column will be lost.
  - You are about to drop the column `numbe_of_joined` on the `elections` table. All the data in the column will be lost.
  - You are about to drop the column `photoId` on the `elections` table. All the data in the column will be lost.
  - You are about to drop the column `voter_count` on the `elections` table. All the data in the column will be lost.
  - Added the required column `candidatesData` to the `elections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dbName` to the `elections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_vote_per_voter_max` to the `elections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_vote_per_voter_min` to the `elections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_voters` to the `elections` table without a default value. This is not possible if the table is not empty.
  - Made the column `data` on table `photos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "elections" DROP COLUMN "data",
DROP COLUMN "numbe_of_joined",
DROP COLUMN "photoId",
DROP COLUMN "voter_count",
ADD COLUMN     "allow_multiple_same_candidate" BOOLEAN,
ADD COLUMN     "candidatesData" JSONB NOT NULL,
ADD COLUMN     "dbName" TEXT NOT NULL,
ADD COLUMN     "dbPsw" TEXT,
ADD COLUMN     "has_skipped" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_download_disabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "number_of_joined" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "number_of_seats_taken" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "number_of_vote_per_voter_max" INTEGER NOT NULL,
ADD COLUMN     "number_of_vote_per_voter_min" INTEGER NOT NULL,
ADD COLUMN     "number_of_voted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "number_of_voters" INTEGER NOT NULL,
ALTER COLUMN "last_used" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "photos" ALTER COLUMN "data" SET NOT NULL;
