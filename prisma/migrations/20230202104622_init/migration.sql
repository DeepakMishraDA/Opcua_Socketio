-- CreateTable
CREATE TABLE "alarms" (
    "id" UUID NOT NULL,
    "node" TEXT NOT NULL,
    "alarm_text" VARCHAR(1000) DEFAULT ' ',
    "severity" INTEGER DEFAULT 500,
    "raised_time" DECIMAL(15,5) NOT NULL DEFAULT 0,
    "relevant" BOOLEAN,
    "archived" BOOLEAN,

    CONSTRAINT "alarms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "alarms_id_idx" ON "alarms"("id");
