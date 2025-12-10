-- CreateTable
CREATE TABLE "WhackARoboScore" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhackARoboScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WhackARoboScore_score_idx" ON "WhackARoboScore"("score");
