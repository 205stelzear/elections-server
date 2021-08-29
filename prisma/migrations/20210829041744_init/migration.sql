-- CreateEnum
CREATE TYPE "ElectionType" AS ENUM ('shared', 'virtual');

-- CreateTable
CREATE TABLE "elections" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "numbe_of_joined" INTEGER NOT NULL DEFAULT 0,
    "voter_count" INTEGER NOT NULL DEFAULT 0,
    "last_used" TIMESTAMP(3) NOT NULL,
    "type" "ElectionType" NOT NULL DEFAULT E'shared',
    "data" JSONB NOT NULL,
    "photoId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" SERIAL NOT NULL,
    "data" TEXT,
    "electionId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "elections.code_unique" ON "elections"("code");

-- CreateIndex
CREATE UNIQUE INDEX "photos_electionId_unique" ON "photos"("electionId");

-- AddForeignKey
ALTER TABLE "photos" ADD FOREIGN KEY ("electionId") REFERENCES "elections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
